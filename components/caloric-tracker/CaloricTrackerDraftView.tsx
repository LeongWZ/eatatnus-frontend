import searchFoods from "@/api/caloric-tracker/searchFoods";
import { Food } from "@/app/types";
import DraftItem from "@/store/interfaces/DraftItem";
import React from "react";
import {
  Pressable,
  View,
  Text,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import {
  AutocompleteDropdown,
  AutocompleteDropdownItem,
} from "react-native-autocomplete-dropdown";
import { isEqual } from "lodash";
import FoodItemView from "./FoodItemView";

type CaloricTrackerDraftViewProps = {
  items: DraftItem[];
  submitDraft: (items: DraftItem[]) => void;
  editDraft: (items: DraftItem[]) => void;
};

export default function CaloricTrackerDraftView(
  props: CaloricTrackerDraftViewProps,
) {
  const { items, submitDraft, editDraft } = props;

  const [itemInput, setItemInput] = React.useState<DraftItem>({
    food: { name: "" },
  });

  const [showItemInput, setShowItemInput] = React.useState<boolean>(false);

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
          items.every((item) => !isEqual(item.food, suggestedFood)),
        ),
      )
      .then(setSuggestedFoods)
      .catch((error: Error) => Alert.alert(error.message));
  }, [itemInput.food.name, items]);

  return (
    <View className="border rounded my-2 p-4 space-y-4">
      <Text className="text-lg">Entry Draft</Text>
      {showItemInput ? (
        <View>
          <AutocompleteDropdown
            clearOnFocus={false}
            closeOnBlur={true}
            closeOnSubmit={true}
            onSubmit={() =>
              itemInput.food.name.length > 0 && editDraft([itemInput, ...items])
            }
            onSelectItem={(item) => {
              if (!item?.title) {
                return;
              }
              editDraft([
                {
                  food: getFood(item) ?? { name: item.title },
                  count: 1,
                },
                ...items,
              ]);
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
      {items.map((item, index) => (
        <FoodItemView
          item={item}
          submitDelete={() =>
            editDraft([...items.slice(0, index), ...items.slice(index + 1)])
          }
          submitEdit={(newItem) =>
            editDraft(items.map((item, i) => (i === index ? newItem : item)))
          }
          key={index}
        />
      ))}
      <View className="items-end">
        <Button
          title="Submit"
          onPress={() => submitDraft(items)}
          disabled={items.length === 0}
        />
      </View>
    </View>
  );
}
