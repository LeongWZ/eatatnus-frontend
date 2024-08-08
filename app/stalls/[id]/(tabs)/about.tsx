import { Stall, Image as ImageType, Canteen, Role, Food } from "@/app/types";
import ErrorView from "@/components/ErrorView";
import { useGlobalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from "react-native";
import { Image } from "expo-image";
import * as MailComposer from "expo-mail-composer";
import * as Clipboard from "expo-clipboard";
import useIdentifiableCollectionReducer from "@/hooks/useIdentifiableCollectionReducer";
import getMenuImagesAsync from "@/services/firebase-functions/getMenuImagesAsync";
import FoodView from "@/components/menu/FoodView";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import AddFoodView from "@/components/menu/AddFoodView";
import updateMenu from "@/services/menus/updateMenu";
import fetchIndividualStall from "@/services/stalls/fetchIndividualStall";
import {
  errorStallCollectionAction,
  loadStallCollectionAction,
  patchStallCollectionAction,
} from "@/store/reducers/stallCollection";
import createMenu from "@/services/menus/createMenu";
import { putCaloricTrackerDraftAction } from "@/store/reducers/caloricTracker";
import { isEqual } from "lodash";
import summariseReviews from "@/services/firebase-functions/summariseReviews";
import ReviewSummary from "@/components/review/ReviewSummary";
import {
  addOrderAction,
  errorOrderCollectionAction,
  loadOrderCollectionAction,
  editOrderAction,
} from "@/store/reducers/orderCollection";
import editOrder from "@/services/orders/editOrder";
import createOrder from "@/services/orders/createOrder";
import fetchIsUserOnboarded from "@/services/payments/fetchIsUserOnboarded";
import OnlinePaymentUnavailableCard from "@/components/menu/OnlinePaymentUnavailableCard";

export default function StallAbout() {
  const params = useGlobalSearchParams();
  const id = parseInt(params.id as string);

  const router = useRouter();
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);

  const stallCollection = useSelector(
    (state: RootState) => state.stallCollection,
  );

  const stall: Stall | undefined = stallCollection.items.find(
    (stall) => stall.id === id,
  );

  const canteenCollection = useSelector(
    (state: RootState) => state.canteenCollection,
  );

  const canteen: Canteen | undefined = canteenCollection.items.find(
    (canteen) => canteen.id === stall?.canteenId,
  );

  const caloricTracker = useSelector(
    (state: RootState) => state.caloricTracker,
  );

  const orderCollection = useSelector(
    (state: RootState) => state.orderCollection,
  );

  const [menuImages, dispatchMenuImagesAction] =
    useIdentifiableCollectionReducer<ImageType>({
      items: [],
      loading: false,
      errorMessage: "",
    });

  const menuFoodItems = [...(stall?.menu?.items ?? [])].sort(
    (a, b) => b.id - a.id,
  );

  const [reviewSummary, setReviewSummary] = React.useState({
    body: "",
    isLoading: false,
  });

  const [isOwnerOnboardedOnStripe, setIsOwnerOnboardedOnStripe] =
    React.useState({
      data: false,
      loading: true,
    });

  const renderMenuImage = ({ item }: { item: ImageType }) => {
    return (
      <Pressable
        onPress={() => stall && router.push(`../photos/?image_id=${item.id}`)}
      >
        <Image
          source={item.url}
          style={{ width: 200, height: 200 }}
          placeholder="Image not found"
        />
      </Pressable>
    );
  };

  const sendEmail = () => {
    MailComposer.composeAsync({
      recipients: ["feedbackers6226@gmail.com"],
      subject: `Claim ${stall?.name} as business owner`,
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
      "Claim this business",
      "Email feedbackers6226@gmail.com to claim this stall.",
      [
        {
          text: "Send email",
          onPress: sendEmail,
        },
        { text: "Cancel" },
      ],
    );
  };

  const addToOrder = (food: Food) => {
    if (!stall) {
      return;
    }

    if (!auth.isAuthenticated) {
      router.push("/signin");
      return;
    }

    const order = orderCollection.items
      .filter((order) => !order.paid && !order.fulfilled)
      .find((order) => order.stallId === stall.id);

    dispatch(loadOrderCollectionAction());
    if (order) {
      const foodExists = order.foods.some((item) => item.food.id === food.id);
      const updatedFoods = foodExists
        ? order.foods.map((item) =>
            item.food.id === food.id
              ? { ...item, count: item.count + 1 }
              : item,
          )
        : order.foods;
      const newFoods = foodExists ? undefined : [{ food: food }];
      editOrder(order.id, updatedFoods, newFoods)
        .then((order) => dispatch(editOrderAction({ item: order })))
        .then(() => ToastAndroid.show("Added to Cart!", ToastAndroid.SHORT))
        .catch((error: Error) => {
          dispatch(
            errorOrderCollectionAction({
              errorMessage: "Failed to add food to order: " + error.message,
            }),
          );
          Alert.alert("Failed to add food to order", error.message);
        });
    } else {
      createOrder(stall.id, [{ food: food }])
        .then((order) => dispatch(addOrderAction({ item: order })))
        .then(() => ToastAndroid.show("Added to Cart!", ToastAndroid.SHORT))
        .catch((error: Error) => {
          dispatch(
            errorOrderCollectionAction({
              errorMessage: "Failed to create order: " + error.message,
            }),
          );
          Alert.alert("Failed to add create order", error.message);
        });
    }
  };

  const onRefresh = () => {
    if (stall === undefined) {
      return;
    }

    dispatch(loadStallCollectionAction());
    fetchIndividualStall(stall.id)
      .then((stall) => dispatch(patchStallCollectionAction({ item: stall })))
      .catch((error) =>
        dispatch(
          errorStallCollectionAction({
            errorMessage: "Failed to fetch stall: " + error,
          }),
        ),
      );
  };

  React.useEffect(() => {
    setMenuImagesAsync();

    setReviewSummary({ ...reviewSummary, isLoading: true });
    summariseReviews(stall?.reviews ?? []).then((body) =>
      setReviewSummary({ body: body, isLoading: false }),
    );

    if (stall?.ownerId) {
      fetchIsUserOnboarded(stall.ownerId)
        .then((onboarded) =>
          setIsOwnerOnboardedOnStripe({ data: onboarded, loading: false }),
        )
        .catch((err) => {
          setIsOwnerOnboardedOnStripe({ data: false, loading: false });
          console.log(err);
        });
    } else {
      setIsOwnerOnboardedOnStripe({ data: false, loading: false });
    }

    async function setMenuImagesAsync() {
      if (menuImages.loading) {
        // prevent race condition or do not process empty array
        return;
      }

      dispatchMenuImagesAction({ type: "LOAD" });

      try {
        const images = stall?.reviews.flatMap((review) => review.images) ?? [];
        const menuImages = await getMenuImagesAsync(images);

        dispatchMenuImagesAction({
          type: "PUT",
          payload: { items: menuImages },
        });
      } catch (error) {
        dispatchMenuImagesAction({
          type: "ERROR",
          payload: {
            errorMessage: error instanceof Error ? error.message : `${error}`,
          },
        });
      }
    }
  }, [stall]);

  if (stall === undefined) {
    return <ErrorView />;
  }

  return (
    <ScrollView className="p-2">
      <View className="mt-2">
        <Text className="text-3xl">{stall.name}</Text>
        <Text className="text-xl">{canteen?.name}</Text>
      </View>

      {auth.isAuthenticated && auth.user?.id !== stall.ownerId && (
        <View className="flex-row mt-4">
          <TouchableOpacity
            className="border rounded p-2"
            onPress={createClaimAlert}
          >
            <Text className="text-sm">Claim this business</Text>
          </TouchableOpacity>
        </View>
      )}

      <View className="mt-2">
        <Text className="text-2xl">Reviews</Text>
        <ReviewSummary
          reviews={stall?.reviews}
          body={reviewSummary.body}
          isBodyLoading={reviewSummary.isLoading}
        />
      </View>

      <View className="mt-4">
        <Text className="text-2xl">Menu</Text>

        <Text>
          Contribute by submitting a review along with an image of a menu.
        </Text>

        {!menuImages.loading &&
          !stall.menu &&
          menuImages.items.length === 0 && (
            <View className="items-center">
              <Text className="p-4">No menu found.</Text>
            </View>
          )}

        {menuImages.loading && menuImages.items.length === 0 && (
          <ActivityIndicator className="my-4" />
        )}

        <FlatList
          data={menuImages.items}
          renderItem={renderMenuImage}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={true}
          style={{ marginVertical: 8, marginLeft: 8 }}
        />

        {!isOwnerOnboardedOnStripe.data &&
          !isOwnerOnboardedOnStripe.loading && <OnlinePaymentUnavailableCard />}

        {(auth.user?.id === stall.ownerId ||
          auth.user?.role === Role.Admin) && (
          <AddFoodView submitCreate={addFoodFn(stall, onRefresh)} />
        )}

        {menuFoodItems.map((item) => (
          <FoodView
            food={item}
            user={auth.user}
            ownerId={stall.ownerId}
            submitDelete={deleteFoodFn(stall, onRefresh)}
            submitEdit={editFoodFn(stall, onRefresh)}
            saveToCaloricTrackerDraft={() => {
              if (
                caloricTracker.draft.some((draft) => isEqual(draft.food, item))
              ) {
                return;
              }
              dispatch(
                putCaloricTrackerDraftAction({
                  items: [...caloricTracker.draft, { food: item }],
                }),
              );
            }}
            addToOrder={
              isOwnerOnboardedOnStripe.data && auth.user?.role !== Role.Business
                ? addToOrder
                : undefined
            }
            onViewNutrition={() => router.push(`../foods/${item.id}`)}
            key={item.id}
          />
        ))}
      </View>
      <View style={{ height: 180 }}>
        {/*  Dummy div for bottom padding. Setting padding-bottom on above does not work */}
      </View>
    </ScrollView>
  );
}

function editFoodFn(stall?: Stall, next?: () => void) {
  return (food: Food) => {
    if (!stall?.menu) {
      return;
    }

    updateMenu(
      stall.menu.id,
      stall.menu.items.map((item) => (item.id === food.id ? food : item)),
    )
      .then(next)
      .catch(console.error);
  };
}

function deleteFoodFn(stall?: Stall, next?: () => void) {
  return (food: Food) => {
    if (!stall?.menu) {
      return;
    }

    updateMenu(
      stall.menu.id,
      stall?.menu.items.filter((item) => item.id !== food.id),
    )
      .then(next)
      .catch(console.error);
  };
}

function addFoodFn(stall?: Stall, next?: () => void) {
  return (food: Omit<Food, "id">) => {
    if (stall?.menu) {
      updateMenu(stall.menu.id, [...stall?.menu.items, food])
        .then(next)
        .catch(console.error);
    } else if (stall) {
      createMenu(stall.id, [food]).then(next).catch(console.error);
    }
  };
}
