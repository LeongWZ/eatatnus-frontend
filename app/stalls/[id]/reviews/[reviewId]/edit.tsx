import editReview from "@/services/reviews/editReview";
import ErrorView from "@/components/ErrorView";
import ReviewForm, { FormData } from "@/components/review/ReviewForm";
import {
  Redirect,
  useGlobalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  loadStallCollectionAction,
  patchStallCollectionAction,
} from "@/store/reducers/stallCollection";
import fetchReview from "@/services/reviews/fetchReview";

export default function StallEditReview() {
  const params = useGlobalSearchParams();
  const stallId = parseInt(params.id as string);
  const reviewId = parseInt(params.reviewId as string);

  const router = useRouter();
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);

  const stallCollection = useSelector(
    (state: RootState) => state.stallCollection,
  );

  const stall = stallCollection.items.find((stall) => stall.id === stallId);

  const review = stall?.reviews.find((review) => review.id === reviewId);

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const submitReviewForm = (formData: FormData) => {
    auth.isAuthenticated &&
      editReview(reviewId, formData)
        .then((res) => fetchReview(res.id))
        .then((updatedReview) => {
          setErrorMessage(null);
          if (stall) {
            dispatch(loadStallCollectionAction());
            dispatch(
              patchStallCollectionAction({
                item: {
                  ...stall,
                  reviews: stall.reviews.map((review) =>
                    review.id === reviewId ? updatedReview : review,
                  ),
                },
              }),
            );
          }
        })
        .then(() => router.back())
        .catch((error) => setErrorMessage(error.toString()));
  };

  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.setOptions({
      title: "Edit Review",
    });
  }, [navigation]);

  if (!auth.isAuthenticated) {
    return <Redirect href="/signin" />;
  }

  if (!stall || !review) {
    return <ErrorView />;
  }

  return (
    <View className="p-2">
      <View className="items-center">
        <Text className="text-3xl p-4">{stall.name}</Text>
      </View>

      <ReviewForm review={review} submitReviewForm={submitReviewForm} />

      {errorMessage && <Text className="text-red-500 m-2">{errorMessage}</Text>}
    </View>
  );
}
