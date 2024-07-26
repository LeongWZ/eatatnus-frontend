import searchFoods from "@/api/caloric-tracker/searchFoods";
import { Food } from "@/app/types";
import React from "react";
import { Pressable, View, Text, Button, Alert } from "react-native";
import {
  AutocompleteDropdown,
  AutocompleteDropdownItem,
} from "react-native-autocomplete-dropdown";

// @ts-expect-error: No declaration file for module
// eslint-disable-next-line import/no-unresolved
import { HoldItem } from "react-native-hold-menu";

type CaloricTrackerDraftViewProps = {
  foods: Omit<Food, "id">[];
  submitDraft: (foods: Omit<Food, "id">[]) => void;
  editDraft: (foods: Omit<Food, "id">[]) => void;
};

export default function CaloricTrackerDraftView(
  props: CaloricTrackerDraftViewProps,
) {
  const { foods, submitDraft, editDraft } = props;

  const [foodInput, setFoodInput] = React.useState<Omit<Food, "id">>({
    name: "",
  });

  const [showFoodInput, setShowFoodInput] = React.useState<boolean>(false);

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
      <Text className="text-lg">Entry Draft</Text>
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
              onPress={() => {
                editDraft([foodInput, ...foods]);
                setFoodInput({ name: "" });
              }}
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
      {foods.map((food, index) => (
        <DraftFoodView
          food={food}
          submitDelete={() =>
            editDraft([...foods.slice(0, index), ...foods.slice(index + 1)])
          }
          key={index}
        />
      ))}
      <View className="items-end">
        <Button
          title="Submit"
          onPress={() => submitDraft(foods)}
          disabled={foods.length === 0}
        />
      </View>
    </View>
  );
}

type DraftFoodViewProps = {
  food: Omit<Food, "id">;
  submitDelete: (food: Omit<Food, "id">) => void;
};

function DraftFoodView(props: DraftFoodViewProps) {
  const { food, submitDelete } = props;

  const MenuItems = [
    {
      text: "Delete",
      icon: "trash",
      isDestructive: true,
      onPress: () => submitDelete(food),
    },
  ];

  return (
    <HoldItem items={MenuItems}>
      <View className="border rounded my-2 p-4">
        <Text className="text-xl">{food.name}</Text>
        {food?.calories && (
          <Text className="text-lg">{`${food.calories} cal`}</Text>
        )}
      </View>
    </HoldItem>
  );
}
