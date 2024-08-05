import { RootState } from "@/store";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { useSelector } from "react-redux";
import { View, Text, ScrollView } from "react-native";
import FoodInfo from "@/components/menu/FoodInfo";
import React from "react";

export default function FoodPage() {
  const params = useGlobalSearchParams();
  const id = parseInt(params.id?.toString() ?? "");
  const foodId = parseInt(params.foodId?.toString() ?? "");

  const stallCollection = useSelector(
    (state: RootState) => state.stallCollection,
  );

  const stall = stallCollection.items.find((stall) => stall.id === id);

  const food = stall?.menu?.items?.find((food) => food.id === foodId);

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
