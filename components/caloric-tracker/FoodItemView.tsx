import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Food } from "@/app/types";

// @ts-expect-error: No declaration file for module
// eslint-disable-next-line import/no-unresolved
import { HoldItem } from "react-native-hold-menu";

type FoodItem = {
  food: Omit<Food, "id">;
  count?: number;
};

type FoodItemViewProps<T extends FoodItem> = {
  item: T;
  submitDelete: () => void;
  submitEdit: (item: T) => void;
  onViewNutrition?: () => void;
};

export default function FoodItemView<T extends FoodItem>(
  props: FoodItemViewProps<T>,
) {
  const { item, submitDelete, submitEdit, onViewNutrition } = props;

  const count = item?.count ?? 1;

  const MenuItems = [
    {
      text: "Delete",
      icon: "trash",
      isDestructive: true,
      onPress: submitDelete,
    },
  ];

  return (
    <HoldItem items={MenuItems}>
      <View className="border rounded my-2 p-4 bg-slate-50">
        <View className="flex-row justify-between">
          <View className="flex-1">
            <Text className="text-xl">{item.food.name}</Text>
            {item.food.calories && (
              <Text className="text-lg">{`${item.food.calories} cal`}</Text>
            )}
          </View>
          <View className="flex-row items-center space-x-2 ml-2">
            <TouchableOpacity
              onPress={() =>
                submitEdit({ ...item, count: Math.max(1, count - 1) })
              }
              disabled={count <= 1}
            >
              <AntDesign
                name="minussquareo"
                size={32}
                color={count <= 1 ? "grey" : "red"}
              />
            </TouchableOpacity>
            <Text className="text-4xl">{item.count ?? 1}</Text>
            <TouchableOpacity
              onPress={() => submitEdit({ ...item, count: count + 1 })}
            >
              <AntDesign name="plussquareo" size={32} color="green" />
            </TouchableOpacity>
          </View>
        </View>
        {"id" in item.food && onViewNutrition && (
          <View className="items-start mt-1">
            <TouchableOpacity onPress={onViewNutrition}>
              <Text className="text-blue-800">View Nutrition</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </HoldItem>
  );
}
