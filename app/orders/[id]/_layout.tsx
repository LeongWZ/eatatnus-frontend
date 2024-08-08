import { Stack, useGlobalSearchParams, useNavigation } from "expo-router";
import { StripeProvider } from "@stripe/stripe-react-native";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Order } from "@/app/types";
import fetchPublishableKey from "@/services/payments/fetchPublishableKey";

export default function OrderLayout() {
  const params = useGlobalSearchParams();
  const id = parseInt(params.id as string);

  const orderCollection = useSelector(
    (state: RootState) => state.orderCollection,
  );

  const order: Order | undefined = orderCollection.items
    .filter((order) => !order.paid && !order.fulfilled)
    .find((order) => order.id === id);

  const [stripeProviderParams, setStripeProviderParams] = React.useState<{
    publishableKey: string;
    stripeAccountId?: string;
  }>({
    publishableKey: "",
  });

  React.useEffect(() => {
    if (order === undefined) {
      return;
    }
    fetchPublishableKey(order.id)
      .then(setStripeProviderParams)
      .catch(console.error);
  }, []);

  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.setOptions({
      title: "Order",
    });
  }, [navigation]);

  return (
    <StripeProvider {...stripeProviderParams}>
      <Stack>
        <Stack.Screen name="checkout" options={{ headerShown: false }} />
      </Stack>
    </StripeProvider>
  );
}
