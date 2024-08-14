import { FoodsOnOrders, Order, Role, Stall, User } from "@/app/types";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import FoodItemView from "./FoodItemView";
import DraftItem from "@/store/interfaces/DraftItem";
import { Link } from "expo-router";

type OrderViewProps = {
  order: Order;
  user: User | null;
  saveToCaloricTrackerDraft: (item: DraftItem) => void;
  deleteOrder: () => void;
  editOrder: (items: FoodsOnOrders[], newItems?: DraftItem[]) => void;
  fulfillOrder: () => void;
  onViewNutrition: (foodId: number) => void;
  onCheckout: () => void;
  stall?: Stall;
  onReview?: () => void;
};

export default function OrderView(props: OrderViewProps) {
  const {
    order,
    user,
    deleteOrder,
    editOrder,
    fulfillOrder,
    saveToCaloricTrackerDraft,
    onViewNutrition,
    onCheckout,
    stall,
    onReview,
  } = props;

  const updatedAtLocaleString: string = new Date(
    order.updatedAt,
  ).toLocaleString();

  const paidAtLocateString: string | undefined = order.paidAt
    ? new Date(order.paidAt).toLocaleString()
    : undefined;

  const totalPrice: number = order.foods.reduce(
    (acc, item) => acc + (item.food.price ?? 0) * item.count,
    0,
  );

  return (
    <View className="border rounded my-2 p-4 space-y-4">
      <View className="items-start">
        <Text className="text-base">Updated at: {updatedAtLocaleString}</Text>
        {stall && (
          <Link href={`/stalls/${stall.id}`} asChild>
            <TouchableOpacity>
              <Text className="mt-2 text-2xl text-blue-800">{stall.name}</Text>
            </TouchableOpacity>
          </Link>
        )}
        <Text className="mt-2 text-sm">Order ID: {order.id}</Text>
        {paidAtLocateString && (
          <Text className="text-sm">Paid at: {paidAtLocateString}</Text>
        )}
        <Text className="mt-4 mb-2 text-3xl">${totalPrice.toFixed(2)}</Text>
      </View>
      {order.foods.map((item, index) => (
        <FoodItemView
          item={item}
          submitDelete={() =>
            order.foods.length > 1
              ? editOrder([
                  ...order.foods.slice(0, index),
                  ...order.foods.slice(index + 1),
                ])
              : deleteOrder()
          }
          submitEdit={(item) =>
            editOrder(order.foods.map((food, i) => (i === index ? item : food)))
          }
          onViewNutrition={() => onViewNutrition(item.food.id)}
          saveToCaloricTrackerDraft={saveToCaloricTrackerDraft}
          disabled={order.paid || order.fulfilled}
          key={`${item.foodId}-${item.count}`}
        />
      ))}
      <View className="flex-row justify-center space-x-2">
        {user?.role !== Role.Business && !order.paid && !order.fulfilled && (
          <TouchableOpacity
            className="my-2 p-2 border-2 border-red-400 rounded-lg"
            onPress={deleteOrder}
          >
            <Text className="text-red-800 text-lg">Delete Order</Text>
          </TouchableOpacity>
        )}
        {user?.role !== Role.Business && !order.paid && !order.fulfilled && (
          <TouchableOpacity
            className="my-2 p-2 border-2 border-green-400 rounded-lg"
            onPress={onCheckout}
          >
            <Text className="text-green-800 text-lg">Checkout</Text>
          </TouchableOpacity>
        )}
        {user?.role !== Role.Business && order.fulfilled && (
          <TouchableOpacity
            className="my-2 p-2 border-2 border-blue-400 rounded-lg"
            onPress={onReview}
          >
            <Text className="text-blue-800 text-lg">Review Stall</Text>
          </TouchableOpacity>
        )}
        {user?.role !== Role.User && order.paid && !order.fulfilled && (
          <TouchableOpacity
            className="my-2 p-2 border-2 border-green-400 rounded-lg"
            onPress={fulfillOrder}
          >
            <Text className="text-green-800 text-lg">Fulfill Order</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
