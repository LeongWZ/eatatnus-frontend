import deleteOrder from "@/services/orders/deleteOrder";
import editOrder from "@/services/orders/editOrder";
import { RootState } from "@/store";
import {
  errorOrderCollectionAction,
  deleteOrderAction,
  editOrderAction,
  putOrderCollectionAction,
  loadOrderCollectionAction,
} from "@/store/reducers/orderCollection";
import { Href, Link, useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  SectionList,
  ScrollView,
  RefreshControl,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Order, FoodsOnOrders, Role, Stall } from "../types";
import OrderView from "@/components/order/OrderView";
import { isEqual } from "lodash";
import { putCaloricTrackerDraftAction } from "@/store/reducers/caloricTracker";
import DraftItem from "@/store/interfaces/DraftItem";
import fulfillOrder from "@/services/orders/fulfillOrder";
import fetchOrders from "@/services/orders/fetchOrders";
import fetchIsUserOnboarded from "@/services/payments/fetchIsUserOnboarded";
import fetchAccountLink from "@/services/payments/fetchAccountLink";
import * as WebBrowser from "expo-web-browser";
import * as MailComposer from "expo-mail-composer";
import * as Clipboard from "expo-clipboard";

export default function OrderPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const auth = useSelector((state: RootState) => state.auth);

  const caloricTracker = useSelector(
    (state: RootState) => state.caloricTracker,
  );

  const orderCollection = useSelector(
    (state: RootState) => state.orderCollection,
  );

  const stallCollection = useSelector(
    (state: RootState) => state.stallCollection,
  );

  const stall: Stall | undefined = stallCollection.items.find(
    (stall) => stall.ownerId === auth.user?.id,
  );

  const [isBusinessUserOnboarded, setIsBusinessUserOnboarded] =
    React.useState<boolean>(false);

  const openStripeAccountLink = () => {
    fetchAccountLink()
      .then(WebBrowser.openBrowserAsync)
      .catch((err) => console.error("An error occurred", err));
  };

  const checkUserOnboarded = () => {
    if (auth.user?.role !== Role.Business) {
      return;
    }
    fetchIsUserOnboarded(auth.user.id)
      .then((isOnboarded) => setIsBusinessUserOnboarded(isOnboarded))
      .catch((error: Error) => {
        dispatch(
          errorOrderCollectionAction({
            errorMessage: error.message,
          }),
        );
        Alert.alert("Failed to fetch user onboarded status", error.message);
      });
  };

  const onRefresh = () => {
    checkUserOnboarded();

    dispatch(loadOrderCollectionAction());
    fetchOrders()
      .then((orders) => dispatch(putOrderCollectionAction({ items: orders })))
      .catch((error: Error) => {
        dispatch(
          errorOrderCollectionAction({
            errorMessage: error.message,
          }),
        );
        Alert.alert("Failed to fetch orders", error.message);
      });
  };

  const deleteOrderFn = (order: Order) => () =>
    deleteOrder(order.id)
      .then(() => dispatch(deleteOrderAction({ item: order })))
      .catch((error: Error) => {
        dispatch(
          errorOrderCollectionAction({
            errorMessage: error.message,
          }),
        );
        Alert.alert("Failed to create order", error.message);
      });

  const editOrderFn = (order: Order) => (items: FoodsOnOrders[]) =>
    editOrder(order.id, items)
      .then((order) => dispatch(editOrderAction({ item: order })))
      .catch((error: Error) => {
        dispatch(
          errorOrderCollectionAction({
            errorMessage: "Failed to delete order: " + error.message,
          }),
        );
        Alert.alert("Failed to delete order: ", error.message);
      });

  const fulfillOrderFn = (order: Order) => () =>
    fulfillOrder(order.id)
      .then((order) => dispatch(editOrderAction({ item: order })))
      .catch((error: Error) => {
        dispatch(
          errorOrderCollectionAction({
            errorMessage: "Failed to fulfill order: " + error.message,
          }),
        );
        Alert.alert("Failed to fulfill order: ", error.message);
      });

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

  const sendEmail = () => {
    MailComposer.composeAsync({
      recipients: ["feedbackers6226@gmail.com"],
      subject: `Claim stall as business owner`,
    }).catch(() =>
      Alert.alert("Unable To Send Feedback", undefined, [
        {
          text: "Copy email",
          onPress: () => Clipboard.setStringAsync("feedbackers6226@gmail.com"),
        },
        { text: "Cancel" },
      ]),
    );
  };

  const createClaimAlert = () => {
    Alert.alert(
      "Claim stall business",
      "Email feedbackers6226@gmail.com to claim a stall business.",
      [
        {
          text: "Send email",
          onPress: sendEmail,
        },
        { text: "Cancel" },
      ],
    );
  };

  React.useEffect(checkUserOnboarded, [auth.user]);

  if (!auth.isAuthenticated) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-lg text-center px-10">
          You have to sign in before you can order
        </Text>
        <Link href="/signin" asChild>
          <TouchableOpacity className="border rounded-lg py-2 px-10 mt-4">
            <Text className="text-xl">Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
    );
  }

  if (auth.user?.role === Role.Business && !isBusinessUserOnboarded) {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        refreshControl={
          <RefreshControl
            refreshing={orderCollection.loading}
            onRefresh={onRefresh}
          />
        }
      >
        <Text className="text-lg text-center px-10">
          Complete your onboarding on Stripe to start receiving orders
        </Text>
        <TouchableOpacity
          className="border rounded-lg py-2 px-10 mt-4"
          onPress={openStripeAccountLink}
        >
          <Text className="text-2xl">Go to Stripe</Text>
        </TouchableOpacity>
        <Text className="text-base mt-8">
          Completed onboarding? Pull down to refresh
        </Text>
      </ScrollView>
    );
  }

  return (
    <View className="p-4">
      {auth.user?.role === Role.Business && stall === undefined && (
        <View className="my-2 items-start space-y-2">
          <Text className="text-base">
            This account is not connected to a stall
          </Text>
          <TouchableOpacity
            className="border rounded p-2"
            onPress={createClaimAlert}
          >
            <Text className="text-base">Claim stall business</Text>
          </TouchableOpacity>
        </View>
      )}
      <SectionList
        onRefresh={onRefresh}
        refreshing={orderCollection.loading}
        sections={[
          ...(auth.user?.role === Role.Business
            ? []
            : [
                {
                  title: "To Pay",
                  data: orderCollection.items.filter(
                    (order) => !order.paid && !order.fulfilled,
                  ),
                },
              ]),
          {
            title:
              auth.user?.role === Role.Business ? "To Fulfill" : "To Receive",
            data: orderCollection.items.filter(
              (order) => order.paid && !order.fulfilled,
            ),
          },
          {
            title: "Fulfilled",
            data: orderCollection.items.filter((order) => order.fulfilled),
          },
        ]}
        renderItem={({ item }) => (
          <OrderView
            order={item}
            user={auth.user}
            stall={stallCollection.items.find(
              (stall) => stall.id === item.stallId,
            )}
            deleteOrder={deleteOrderFn(item)}
            editOrder={editOrderFn(item)}
            fulfillOrder={fulfillOrderFn(item)}
            saveToCaloricTrackerDraft={saveToCaloricTrackerDraft}
            onViewNutrition={(foodId) =>
              router.push(`/stalls/${item.stallId}/foods/${foodId}`)
            }
            onCheckout={() =>
              router.push(`/orders/${item.id}/checkout` as Href<string>)
            }
            onReview={() =>
              router.push(
                `/stalls/${item.stallId}/(tabs)/reviews` as Href<string>,
              )
            }
          />
        )}
        renderSectionHeader={({
          section: { title },
        }: {
          section: { title: string };
        }) => <Text className="my-2 text-2xl">{title}</Text>}
        renderSectionFooter={({ section }) =>
          section.data.length === 0 ? (
            <Text className="mt-1 mb-4 text-base">None</Text>
          ) : null
        }
        keyExtractor={(item, index) => item.id.toString() + index}
      />
    </View>
  );
}
