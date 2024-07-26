import { Food } from "@/app/types";
import React from "react";
import { View, Text } from "react-native";

// @ts-expect-error: No declaration file for module
// eslint-disable-next-line import/no-unresolved
import { HoldItem } from "react-native-hold-menu";

type FoodViewProps = {
  food: Food;
  submitDelete: (food: Food) => void;
};

export default function FoodView(props: FoodViewProps) {
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
        <Text className="text-lg">
          {food.calories ? `${food.calories} cal` : ""}
        </Text>
      </View>
    </HoldItem>
  );
}
