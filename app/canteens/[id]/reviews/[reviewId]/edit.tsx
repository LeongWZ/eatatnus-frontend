import editReview from "@/services/reviews/editReview";
import ErrorView from "@/components/ErrorView";
import ReviewForm, { FormData } from "@/components/review/ReviewForm";
import { RootState } from "@/store";
import { Redirect, useGlobalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import {
  loadCanteenCollectionAction,
  patchCanteenCollectionAction,
} from "@/store/reducers/canteenCollection";
import fetchReview from "@/services/reviews/fetchReview";

export default function CanteenEditReview() {
  const params = useGlobalSearchParams();
  const canteenId = parseInt(params.id as string);
  const reviewId = parseInt(params.reviewId as string);

  const router = useRouter();
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);

  const canteenCollection = useSelector(
    (state: RootState) => state.canteenCollection,
  );

  const canteen = canteenCollection.items.find(
    (canteen) => canteen.id === canteenId,
  );

  const review = canteen?.reviews.find((review) => review.id === reviewId);

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const submitReviewForm = (formData: FormData) => {
    auth.isAuthenticated &&
      editReview(reviewId, formData)
        .then((res) => fetchReview(res.id))
        .then((updatedReview) => {
          setErrorMessage(null);
          if (canteen) {
            dispatch(loadCanteenCollectionAction());
            dispatch(
              patchCanteenCollectionAction({
                item: {
                  ...canteen,
                  reviews: canteen.reviews.map((review) =>
                    review.id === reviewId ? updatedReview : review,
                  ),
                },
              }),
            );
          }
        })
        .then(() => router.back())
        .catch((error) => {
          setErrorMessage(error.toString());
          console.error(error);
        });
  };

  if (!auth.isAuthenticated) {
    return <Redirect href="/signin" />;
  }

  if (!canteen || !review) {
    return <ErrorView />;
  }

  return (
    <View className="p-2">
      <View className="items-center">
        <Text className="text-3xl p-4">{canteen.name}</Text>
      </View>
      <ReviewForm review={review} submitReviewForm={submitReviewForm} />

      {errorMessage && <Text className="text-red-500 m-2">{errorMessage}</Text>}
    </View>
  );
}
