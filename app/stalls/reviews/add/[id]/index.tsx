import fetchIndividualStall from "@/services/stalls/fetchIndividualStall";
import submitReview from "@/services/stalls/submitReview";
import ErrorView from "@/components/ErrorView";
import ReviewForm, { FormData } from "@/components/review/ReviewForm";
import { RootState } from "@/store";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  loadStallCollectionAction,
  patchStallCollectionAction,
} from "@/store/reducers/stallCollection";

export default function StallAddReview() {
  const params = useLocalSearchParams();
  const stallId = parseInt(params.id as string);

  const router = useRouter();
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);

  const stallCollection = useSelector(
    (state: RootState) => state.stallCollection,
  );

  const stall = stallCollection.items.find((stall) => stall.id === stallId);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const submitReviewForm = (formData: FormData) => {
    auth.isAuthenticated &&
      submitReview({ ...formData, stallId: stallId })
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

  if (stall === undefined) {
    return <ErrorView />;
  }

  return (
    <View className="p-2">
      <Text className="text-3xl">Review stall</Text>
      <Text className="text-2xl mb-2">{stall.name}</Text>

      <ReviewForm submitReviewForm={submitReviewForm} />

      {errorMessage && <Text className="text-red-500 m-2">{errorMessage}</Text>}
    </View>
  );
}
