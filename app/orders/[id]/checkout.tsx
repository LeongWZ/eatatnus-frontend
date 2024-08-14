import { FoodsOnOrders, Order, Stall } from "@/app/types";
import ErrorView from "@/components/ErrorView";
import OrderCheckoutView from "@/components/order/OrderCheckoutView";
import deleteOrder from "@/services/orders/deleteOrder";
import editOrder from "@/services/orders/editOrder";
import fetchIndividualOrder from "@/services/orders/fetchIndividualOrder";
import fetchPaymentSheetParams from "@/services/payments/fetchPaymentSheetParams";
import fetchPublishableKey from "@/services/payments/fetchPublishableKey";
import { RootState } from "@/store";
import DraftItem from "@/store/interfaces/DraftItem";
import { putCaloricTrackerDraftAction } from "@/store/reducers/caloricTracker";
import {
  deleteOrderAction,
  editOrderAction,
  errorOrderCollectionAction,
} from "@/store/reducers/orderCollection";
import { initStripe, useStripe } from "@stripe/stripe-react-native";
import { useGlobalSearchParams, useNavigation, useRouter } from "expo-router";
import { isEqual } from "lodash";
import React from "react";
import { ScrollView, Alert, ActivityIndicator, View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function CheckoutPage() {
  const params = useGlobalSearchParams();
  const id = parseInt(params.id as string);

  const orderCollection = useSelector(
    (state: RootState) => state.orderCollection,
  );

  const order: Order | undefined = orderCollection.items
    .filter((order) => !order.paid && !order.fulfilled)
    .find((order) => order.id === id);

  const [isStripeInitialising, setIsStripeInitialising] =
    React.useState<boolean>(true);

  React.useEffect(() => {
    if (order === undefined) {
      return;
    }
    fetchPublishableKey(order.stallId)
      .then((params) =>
        initStripe({
          publishableKey: params.publishableKey,
          stripeAccountId: params.stripeAccountId,
        }),
      )
      .then(() => setIsStripeInitialising(false))
      .catch((error) => Alert.alert("Failed to initialise Stripe", error));
  }, []);

  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.setOptions({
      title: "Checkout",
    });
  }, [navigation]);

  if (order === undefined) {
    return <ErrorView />;
  }

  if (isStripeInitialising) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
        <Text className="text-base">Loading...</Text>
      </View>
    );
  }

  return <CheckoutScreen order={order} />;
}

function CheckoutScreen({ order }: { order: Order }) {
  const router = useRouter();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = React.useState(false);

  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);

  const caloricTracker = useSelector(
    (state: RootState) => state.caloricTracker,
  );

  const stallCollection = useSelector(
    (state: RootState) => state.stallCollection,
  );

  const stall: Stall | undefined = stallCollection.items.find(
    (stall) => stall.id === order?.stallId,
  );

  const initializePaymentSheet = async () => {
    if (loading || order === undefined) {
      return;
    }

    const { paymentIntent } = await fetchPaymentSheetParams(order.id).catch(
      (err) => {
        Alert.alert("Error: failed to fetch payment intent", `${err}}`);
        return { paymentIntent: null };
      },
    );

    const { error } = await initPaymentSheet({
      merchantDisplayName: stall?.name ?? "Stall",
      paymentIntentClientSecret: paymentIntent ?? "",
      defaultBillingDetails: {
        name: auth.user?.name,
      },
    });

    if (!error) {
      setLoading(true);
    }
  };

  const saveToCaloricTrackerDraft = (draftItem: DraftItem) => {
    if (caloricTracker.draft.some((draft) => isEqual(draft.food, draftItem))) {
      return;
    }
    dispatch(
      putCaloricTrackerDraftAction({
        items: [...caloricTracker.draft, draftItem],
      }),
    );
  };

  const onDeleteOrder = () => {
    if (order === undefined) {
      return;
    }
    deleteOrder(order.id)
      .then(() => dispatch(deleteOrderAction({ item: order })))
      .then(() =>
        router.canGoBack() ? router.back() : router.replace("/orders"),
      )
      .catch((error: Error) => {
        dispatch(
          errorOrderCollectionAction({
            errorMessage: error.message,
          }),
        );
        Alert.alert("Failed to create order", error.message);
      });
  };

  const openPaymentSheet = async () => {
    if (order === undefined) {
      return;
    }

    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      return;
    }

    fetchIndividualOrder(order.id)
      .then((updatedOrder) => dispatch(editOrderAction({ item: updatedOrder })))
      .then(() => Alert.alert("Success", "Your order is confirmed!"))
      .then(() =>
        router.canGoBack() ? router.back() : router.replace("/orders"),
      )
      .catch((error) =>
        Alert.alert(`Error code: ${error.code}`, error.message),
      );
  };

  React.useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <ScrollView className="p-4">
      <OrderCheckoutView
        order={order}
        stall={stallCollection.items.find(
          (stall) => stall.id === order.stallId,
        )}
        saveToCaloricTrackerDraft={saveToCaloricTrackerDraft}
        onCancel={() =>
          router.canGoBack() ? router.back() : router.replace("/orders")
        }
        onPayment={openPaymentSheet}
        disabled={!loading}
      />
    </ScrollView>
  );
}
