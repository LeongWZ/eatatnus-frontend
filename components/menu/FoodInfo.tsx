import { Food } from "@/app/types";
import React from "react";
import { View, Text } from "react-native";

type FoodInfoProps = {
  food: Food;
};

export default function FoodInfo(props: FoodInfoProps) {
  const { food } = props;

  const data = [
    { label: "Calories", value: food.calories },
    { label: "Cholesterol", value: food.cholesterol },
    { label: "Dietary Fiber", value: food.dietaryFiber },
    { label: "Potassium", value: food.potassium },
    { label: "Protein", value: food.protein },
    { label: "Saturated Fat", value: food.saturatedFat },
    { label: "Serving Qty", value: food.servingQty },
    { label: "Serving Unit", value: food.servingUnit },
    { label: "Serving Weight (g)", value: food.servingWeightGrams },
    { label: "Sodium", value: food.sodium },
    { label: "Sugars", value: food.sugars },
    { label: "Total Carbohydrate", value: food.totalCarbohydrate },
    { label: "Total Fat", value: food.totalFat },
  ];

  return (
    <View>
      <Text className="text-2xl">{food.name}</Text>
      <View className="mt-4">
        {data.map((x) => (
          <Row key={x.label} label={x.label} value={x.value} />
        ))}
      </View>
    </View>
  );
}

function Row({ label, value }: { label: string; value: any }) {
  return (
    <View className="flex-row justify-between items-center border-t py-1">
      <Text className="text-base">{label}</Text>
      <Text className="text-lg">{value}</Text>
    </View>
  );
}
