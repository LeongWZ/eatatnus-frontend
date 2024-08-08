import { Food, Role, User } from "@/app/types";
import AntDesign from "@expo/vector-icons/AntDesign";
import React from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
} from "react-native";

// @ts-expect-error: No declaration file for module
// eslint-disable-next-line import/no-unresolved
import { HoldItem } from "react-native-hold-menu";

type FoodViewProps = {
  food: Food;
  user: User | null;
  ownerId?: number | null;
  submitEdit: (food: Food) => void;
  submitDelete: (food: Food) => void;
  saveToCaloricTrackerDraft: (food: Food) => void;
  addToOrder?: (food: Food) => void;
  onViewNutrition?: () => void;
};

export default function FoodView(props: FoodViewProps) {
  const {
    user,
    food,
    ownerId,
    submitDelete,
    submitEdit,
    saveToCaloricTrackerDraft,
    addToOrder,
    onViewNutrition,
  } = props;

  const [editMode, setEditMode] = React.useState<boolean>(false);

  const [foodVar, setFoodVar] = React.useState<Food>(food);

  const MenuItems = [
    {
      text: "Add to Entry Draft",
      icon: "save",
      onPress: () => saveToCaloricTrackerDraft(food),
    },
    ...(user?.id === ownerId || user?.role === Role.Admin
      ? [
          { text: "Edit", icon: "edit", onPress: () => setEditMode(true) },
          {
            text: "Delete",
            icon: "trash",
            isDestructive: true,
            onPress: () => submitDelete(foodVar),
          },
        ]
      : []),
  ];

  if (editMode) {
    return (
      <EditFoodView
        food={foodVar}
        onCancel={() => setEditMode(false)}
        submitEdit={(food) => {
          setEditMode(false);
          setFoodVar(food);
          submitEdit(food);
        }}
      />
    );
  }

  return (
    <HoldItem items={MenuItems}>
      <View className="flex-row justify-center border rounded my-2 p-4 bg-white">
        <View className="flex-1">
          <Text className="text-xl">{foodVar.name}</Text>
          <Text className="text-lg">
            {foodVar.calories ? `${foodVar.calories} cal` : ""}
          </Text>
          {onViewNutrition && (
            <View className="items-start mt-1">
              <TouchableOpacity onPress={onViewNutrition}>
                <Text className="text-blue-800">View Nutrition</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View className="flex-1 justify-center items-end space-y-2 ml-2">
          {foodVar.price && (
            <Text className="text-3xl">${foodVar.price.toFixed(2)}</Text>
          )}
          {addToOrder && (
            <TouchableOpacity
              className="flex-row items-center space-x-1 border rounded p-2"
              onPress={() => addToOrder(food)}
              disabled={user?.role === Role.Business}
            >
              <AntDesign name="shoppingcart" size={22} color="green" />
              <Text className="text-lg">Add to cart</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </HoldItem>
  );
}

type EditFoodViewProps = {
  food: Food;
  onCancel: () => void;
  submitEdit: (food: Food) => void;
};

function EditFoodView(props: EditFoodViewProps) {
  const { food, submitEdit, onCancel } = props;

  const [editedFood, setEditedFood] = React.useState<Food>(food);

  return (
    <View className="border rounded my-2 p-4 space-y-4">
      <View>
        <Text className="text-lg">Food name:</Text>
        <TextInput
          className="border rounded p-2 text-xl"
          onChangeText={(text) => setEditedFood({ ...editedFood, name: text })}
          value={editedFood.name}
        />
      </View>
      <View>
        <Text className="text-lg">Price ($):</Text>
        <TextInput
          className="border rounded p-2 text-xl"
          onChangeText={(text) =>
            setEditedFood({
              ...editedFood,
              price: Math.floor(parseFloat(text) * 100) / 100,
            })
          }
          keyboardType="numeric"
          defaultValue={food.price?.toFixed(2)}
        />
      </View>
      <View className="flex-row space-x-4">
        <Pressable
          className="border-2 rounded border-red-400 p-2"
          onPress={onCancel}
        >
          <Text className="text-lg text-red-700">Cancel</Text>
        </Pressable>
        <Pressable
          className="border-2 rounded border-blue-400 p-2"
          onPress={() => submitEdit(editedFood)}
        >
          <Text className="text-lg text-blue-700">Save</Text>
        </Pressable>
      </View>
    </View>
  );
}
