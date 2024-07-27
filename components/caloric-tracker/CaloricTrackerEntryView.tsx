import {
  CaloricTrackerEntry,
  Food,
  FoodsOnCaloricTrackerEntries,
} from "@/app/types";
import React from "react";
import { Pressable, View, Text, TouchableOpacity, Alert } from "react-native";
import FoodItemView from "./FoodItemView";
import {
  AutocompleteDropdown,
  AutocompleteDropdownItem,
} from "react-native-autocomplete-dropdown";
import searchFoods from "@/api/caloric-tracker/searchFoods";
import DraftItem from "@/store/interfaces/DraftItem";
import { isEqual } from "lodash";

type CaloricTrackerEntryViewProps = {
  entry: CaloricTrackerEntry;
  deleteEntry: () => void;
  editEntry: (
    items: FoodsOnCaloricTrackerEntries[],
    newItems?: DraftItem[],
  ) => void;
};

export default function CaloricTrackerEntryView(
  props: CaloricTrackerEntryViewProps,
) {
  const { entry, deleteEntry, editEntry } = props;

  const [showItemInput, setShowItemInput] = React.useState<boolean>(false);

  const localeString: string = new Date(entry.createdAt).toLocaleString();

  const totalCalories: number = Math.round(
    entry.foods.reduce(
      (acc, item) => acc + (item.food.calories ?? 0) * item.count,
      0,
    ),
  );

  const [itemInput, setItemInput] = React.useState<DraftItem>({
    food: { name: "" },
  });

  const [suggestedFoods, setSuggestedFoods] = React.useState<Food[]>([]);

  const getFood = (item: AutocompleteDropdownItem | null): Food | undefined =>
    suggestedFoods.find((food) => food.id === parseInt(item?.id ?? ""));

  const renderFoodSuggestion = (item: AutocompleteDropdownItem) => {
    const food = getFood(item);
    return (
      <View className="flex-row justify-between p-2">
        <Text>{item.title}</Text>
        {food?.calories && <Text>{food.calories} cal</Text>}
      </View>
    );
  };

  React.useEffect(() => {
    if (itemInput.food.name.length === 0) {
      setSuggestedFoods([]);
      return;
    }

    if (itemInput.food.name.length < 3) {
      return;
    }

    searchFoods(itemInput.food.name, 10)
      .then((suggestedFoods) =>
        suggestedFoods.filter((suggestedFood) =>
          entry.foods.every((item) => !isEqual(item.food, suggestedFood)),
        ),
      )
      .then(setSuggestedFoods)
      .catch((error: Error) => Alert.alert(error.message));
  }, [itemInput.food.name, entry.foods]);

  return (
    <View className="border rounded my-2 p-4 space-y-4">
      <Text className="text-lg">{localeString}</Text>
      <Text className="text-2xl">{totalCalories} cal</Text>
      {showItemInput ? (
        <View>
          <AutocompleteDropdown
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={true}
            onSubmit={() =>
              itemInput.food.name.length > 0 &&
              editEntry([...entry.foods], [itemInput])
            }
            onSelectItem={(item) => {
              if (!item?.title) {
                return;
              }
              editEntry(
                [...entry.foods],
                [
                  {
                    food: getFood(item) ?? { name: item.title },
                    count: 1,
                  },
                ],
              );
            }}
            dataSet={suggestedFoods.map((food) => ({
              id: food.id.toString(),
              title: food.name,
            }))}
            onChangeText={(text) =>
              setItemInput({ food: { name: text }, count: 1 })
            }
            renderItem={renderFoodSuggestion}
            textInputProps={{
              placeholder: "Add food name...",
              autoCorrect: false,
              autoCapitalize: "none",
              style: {
                backgroundColor: "white",
                color: "black",
                paddingLeft: 18,
              },
            }}
            inputContainerStyle={{
              backgroundColor: "white",
              borderRadius: 25,
            }}
            suggestionsListContainerStyle={{
              backgroundColor: "white",
            }}
          />
          <View className="flex-row space-x-2 my-2">
            <Pressable
              className="border-2 rounded border-red-400 active:bg-red-100 p-2"
              onPress={() => {
                setShowItemInput(false);
              }}
            >
              <Text className="text-lg text-red-700">Cancel</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          className="items-center border rounded-lg py-2 px-10"
          onPress={() => setShowItemInput(true)}
        >
          <Text className="text-lg">Add item</Text>
        </TouchableOpacity>
      )}
      {entry.foods.map((item, index) => (
        <FoodItemView
          item={item}
          submitDelete={() =>
            entry.foods.length > 1
              ? editEntry([
                  ...entry.foods.slice(0, index),
                  ...entry.foods.slice(index + 1),
                ])
              : deleteEntry()
          }
          submitEdit={(item) =>
            editEntry(entry.foods.map((food, i) => (i === index ? item : food)))
          }
          key={`${item.foodId}-${item.count}`}
        />
      ))}
      <View className="items-center">
        <TouchableOpacity
          className="my-2 p-2 border-2 border-red-400 rounded-lg"
          onPress={deleteEntry}
        >
          <Text className="text-red-800 text-lg">Delete Entry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
