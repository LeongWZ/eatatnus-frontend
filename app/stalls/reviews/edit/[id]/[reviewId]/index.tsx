import fetchIndividualStall from "@/api/stalls/fetchIndividualStall";
import editReview from "@/api/reviews/editReview";
import ErrorView from "@/components/ErrorView";
import ReviewForm, { FormData } from "@/components/review/ReviewForm";
import { Redirect, useGlobalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  loadStallCollectionAction,
  patchStallCollectionAction,
} from "@/store/reducers/stallCollection";

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
        .then(async (res) => {
          setErrorMessage(null);
          dispatch(loadStallCollectionAction());
          dispatch(
            patchStallCollectionAction({
              item: await fetchIndividualStall(stallId),
            }),
          );
        })
        .then(() => router.back())
        .catch((error) => setErrorMessage(error.toString()));
  };

  if (!auth.isAuthenticated) {
    return <Redirect href="/signin" />;
  }

  if (!stall || !review) {
    return <ErrorView />;
  }

  return (
    <View>
      <Text className="text-3xl">Review stall</Text>
      <Text className="text-2xl">{stall.name}</Text>

      <ReviewForm review={review} submitReviewForm={submitReviewForm} />

      {errorMessage && <Text className="text-red-500 m-2">{errorMessage}</Text>}
    </View>
  );
}
