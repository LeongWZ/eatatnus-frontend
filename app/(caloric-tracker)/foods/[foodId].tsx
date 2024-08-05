import { RootState } from "@/store";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { useSelector } from "react-redux";
import { View, Text, ScrollView } from "react-native";
import FoodInfo from "@/components/menu/FoodInfo";
import React from "react";

export default function FoodPage() {
  const params = useGlobalSearchParams();
  const foodId = parseInt(params.foodId?.toString() ?? "");

  const caloricTracker = useSelector(
    (state: RootState) => state.caloricTracker,
  );

  const food = caloricTracker.caloricTrackerEntries
    .flatMap((entry) => entry.foods)
    .map((item) => item.food)
    .find((food) => food.id === foodId);

  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.setOptions({
      title: "Nutrition Info",
    });
  }, [navigation]);

  if (!food) {
    return (
      <View className="p-3">
        <Text className="text-base">Food not found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="p-3 pt-4">
      <FoodInfo food={food} />
    </ScrollView>
  );
}
