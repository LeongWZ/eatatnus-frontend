import fetchIndividualCanteen from "@/api/canteens/fetchIndividualCanteen";
import editReview from "@/api/reviews/editReview";
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
        .then(async (res) => {
          setErrorMessage(null);
          dispatch(loadCanteenCollectionAction());
          dispatch(
            patchCanteenCollectionAction({
              item: await fetchIndividualCanteen(canteenId),
            }),
          );
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
    <View>
      <View className="items-center">
        <Text className="text-3xl p-2">{canteen.name}</Text>
      </View>
      <ReviewForm review={review} submitReviewForm={submitReviewForm} />

      {errorMessage && <Text className="text-red-500 m-2">{errorMessage}</Text>}
    </View>
  );
}
