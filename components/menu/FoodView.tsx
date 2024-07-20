import { Food } from "@/app/types";
import { View, Text } from "react-native";

type FoodProps = {
  food: Food;
};

export default function FoodView(props: FoodProps) {
  const { food } = props;

  return (
    <View className="border rounded my-2 p-4">
      <Text className="text-xl">{food.name}</Text>
      <Text className="text-lg">
        {food.calories ? `${food.calories} cal` : ""}
      </Text>
    </View>
  );
}
