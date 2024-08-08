import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { FoodsOnOrders } from "@/app/types";

// @ts-expect-error: No declaration file for module
// eslint-disable-next-line import/no-unresolved
import { HoldItem } from "react-native-hold-menu";
import DraftItem from "@/store/interfaces/DraftItem";

type FoodItemViewProps = {
  item: FoodsOnOrders;
  submitDelete: () => void;
  submitEdit: (item: FoodsOnOrders) => void;
  saveToCaloricTrackerDraft: (item: DraftItem) => void;
  disabled?: boolean;
  onViewNutrition?: () => void;
};

export default function FoodItemView(props: FoodItemViewProps) {
  const {
    item,
    submitDelete,
    submitEdit,
    saveToCaloricTrackerDraft,
    disabled,
    onViewNutrition,
  } = props;

  const count = item?.count ?? 1;

  const MenuItems = [
    {
      text: "Add to Entry Draft",
      icon: "save",
      onPress: () => saveToCaloricTrackerDraft(item),
    },
    ...(disabled
      ? []
      : [
          {
            text: "Delete",
            icon: "trash",
            isDestructive: true,
            onPress: submitDelete,
          },
        ]),
  ];

  return (
    <HoldItem items={MenuItems}>
      <View className="flex-row justify-between border rounded my-2 p-4 bg-slate-50">
        <View className="flex-1">
          <Text className="text-xl">{item.food.name}</Text>
          {item.food.price && (
            <Text className="text-lg">${item.food.price.toFixed(2)}</Text>
          )}
          {onViewNutrition && (
            <View className="items-start mt-1">
              <TouchableOpacity onPress={onViewNutrition}>
                <Text className="text-blue-800">View Nutrition</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View className="flex-row items-center space-x-2 ml-2">
          <TouchableOpacity
            onPress={() =>
              submitEdit({ ...item, count: Math.max(1, count - 1) })
            }
            disabled={count <= 1 || disabled}
          >
            <AntDesign
              name="minussquareo"
              size={32}
              color={disabled || count <= 1 ? "grey" : "red"}
            />
          </TouchableOpacity>
          <Text className="text-4xl">{item.count ?? 1}</Text>
          <TouchableOpacity
            onPress={() => submitEdit({ ...item, count: count + 1 })}
            disabled={disabled}
          >
            <AntDesign
              name="plussquareo"
              size={32}
              color={disabled ? "grey" : "green"}
            />
          </TouchableOpacity>
        </View>
      </View>
    </HoldItem>
  );
}
