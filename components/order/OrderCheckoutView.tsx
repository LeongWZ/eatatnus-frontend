import { FoodsOnOrders, Order, Stall } from "@/app/types";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FoodItemView from "./FoodItemView";
import DraftItem from "@/store/interfaces/DraftItem";
import { Link } from "expo-router";

type OrderCheckoutViewProps = {
  order: Order;
  saveToCaloricTrackerDraft: (item: DraftItem) => void;
  onCancel: () => void;
  onPayment: () => void;
  stall?: Stall;
  disabled?: boolean;
};

export default function OrderCheckoutView(props: OrderCheckoutViewProps) {
  const {
    order,
    saveToCaloricTrackerDraft,
    onCancel,
    onPayment,
    stall,
    disabled,
  } = props;

  const localeString: string = new Date(order.createdAt).toLocaleString();

  const totalPrice: number = order.foods.reduce(
    (acc, item) => acc + (item.food.price ?? 0) * item.count,
    0,
  );

  return (
    <View className="border rounded my-2 p-4 space-y-4">
      <View className="items-start">
        <Text className="text-lg">{localeString}</Text>
        {stall && (
          <Link href={`/stalls/${stall.id}`} asChild>
            <TouchableOpacity>
              <Text className="mt-2 text-2xl text-blue-800">{stall.name}</Text>
            </TouchableOpacity>
          </Link>
        )}
        <Text className="mt-2 text-sm">Order ID: {order.id}</Text>
        <Text className="mt-4 mb-2 text-3xl">${totalPrice.toFixed(2)}</Text>
      </View>
      {order.foods.map((item, index) => (
        <FoodItemView
          item={item}
          submitDelete={() => {}}
          submitEdit={(item) => {}}
          saveToCaloricTrackerDraft={saveToCaloricTrackerDraft}
          disabled={true}
          key={`${item.foodId}-${item.count}`}
        />
      ))}
      <View className="flex-row justify-between">
        <TouchableOpacity
          className="my-2 p-2 border-2 border-red-400 rounded-lg"
          onPress={onCancel}
          disabled={disabled}
        >
          <Text className="text-red-800 text-lg">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="my-2 p-2 border-2 border-green-400 rounded-lg"
          onPress={onPayment}
          disabled={disabled}
        >
          <Text className="text-green-800 text-lg">Make Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
