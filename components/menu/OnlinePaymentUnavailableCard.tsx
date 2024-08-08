import { View, Text } from "react-native";

export default function OnlinePaymentUnavailableCard() {
  return (
    <View>
      <View className="bg-red-500 rounded-t px-4 py-2">
        <Text className="text-white font-bold">Online Payment Unavailable</Text>
      </View>
      <View className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3">
        <Text className="text-red-700">
          The owner has not set up payment processing yet. Online orders cannot
          be accepted at this time.
        </Text>
      </View>
    </View>
  );
}
