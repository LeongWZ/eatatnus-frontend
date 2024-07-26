import { CaloricTrackerEntry, Food } from "@/app/types";
import React from "react";
import { Pressable, View, Text, TouchableOpacity, Alert } from "react-native";
import FoodView from "./FoodView";
import {
  AutocompleteDropdown,
  AutocompleteDropdownItem,
} from "react-native-autocomplete-dropdown";
import searchFoods from "@/api/caloric-tracker/searchFoods";

type CaloricTrackerEntryViewProps = {
  entry: CaloricTrackerEntry;
  deleteEntry: () => void;
  editEntry: (foods: Omit<Food, "id">[]) => void;
};

export default function CaloricTrackerEntryView(
  props: CaloricTrackerEntryViewProps,
) {
  const { entry, deleteEntry, editEntry } = props;

  const [showFoodInput, setShowFoodInput] = React.useState<boolean>(false);

  const localeString: string = new Date(entry.createdAt).toLocaleString();

  const totalCalories: number = Math.round(
    entry.foods.reduce((acc, food) => acc + (food.calories ?? 0), 0),
  );

  const [foodInput, setFoodInput] = React.useState<Omit<Food, "id">>({
    name: "",
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
    if (foodInput.name.length === 0) {
      setSuggestedFoods([]);
      return;
    }

    if (foodInput.name.length < 3) {
      return;
    }

    searchFoods(foodInput.name, 5)
      .then(setSuggestedFoods)
      .catch((error: Error) => Alert.alert(error.message));
  }, [foodInput.name]);

  return (
    <View className="border rounded my-2 p-4 space-y-4">
      <Text className="text-lg">{localeString}</Text>
      <Text className="text-2xl">{totalCalories} cal</Text>
      {showFoodInput ? (
        <View>
          <Text className="text-lg">Food name:</Text>
          <AutocompleteDropdown
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={false}
            onSelectItem={(item) =>
              setFoodInput(
                getFood(item) ?? {
                  name: item?.title ?? "",
                },
              )
            }
            dataSet={suggestedFoods.map((food) => ({
              id: food.id.toString(),
              title: food.name,
            }))}
            onChangeText={(text) => setFoodInput({ name: text })}
            renderItem={renderFoodSuggestion}
          />
          <View className="flex-row space-x-2 my-2">
            <Pressable
              className="border-2 rounded border-red-400 active:bg-red-100 p-2"
              onPress={() => {
                setShowFoodInput(false);
              }}
            >
              <Text className="text-lg text-red-700">Cancel</Text>
            </Pressable>
            <Pressable
              className="border-2 rounded border-blue-400 active:bg-blue-100 p-2"
              onPress={() => editEntry([foodInput, ...entry.foods])}
              disabled={foodInput.name === ""}
            >
              <Text className="text-lg text-blue-700">Save</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          className="items-center border rounded-lg py-2 px-10 active:bg-slate-400"
          onPress={() => setShowFoodInput(true)}
        >
          <Text className="text-lg">+ Menu item</Text>
        </Pressable>
      )}
      {entry.foods.map((item) => (
        <FoodView
          food={item}
          submitDelete={() =>
            entry.foods.length > 1
              ? editEntry(entry.foods.filter((food) => food.id !== item.id))
              : deleteEntry()
          }
          key={item.id}
        />
      ))}
      <View className="flex-row">
        <TouchableOpacity
          className="my-2 p-2 border-2 border-red-400 rounded"
          onPress={deleteEntry}
        >
          <Text className="text-red-800 text-lg">Delete Entry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
