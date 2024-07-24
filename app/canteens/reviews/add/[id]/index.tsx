import fetchIndividualCanteen from "@/api/canteens/fetchIndividualCanteen";
import submitCanteenReview from "@/api/canteens/submitReview";
import ErrorView from "@/components/ErrorView";
import ReviewForm, { FormData } from "@/components/review/ReviewForm";
import { RootState } from "@/store";
import { Redirect, useGlobalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  loadCanteenCollectionAction,
  patchCanteenCollectionAction,
} from "@/store/reducers/canteenCollection";

export default function CanteenAddReview() {
  const params = useGlobalSearchParams();
  const canteenId = parseInt(params.id as string);

  const router = useRouter();
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);

  const canteenCollection = useSelector(
    (state: RootState) => state.canteenCollection,
  );

  const canteen = canteenCollection.items.find(
    (canteen) => canteen.id === canteenId,
  );

  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const submitReviewForm = (formData: FormData) => {
    auth.isAuthenticated &&
      submitCanteenReview({
        ...formData,
        canteenId: canteenId,
      })
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
        .catch((error) => setErrorMessage(error.toString()));
  };

  if (!auth.isAuthenticated) {
    return <Redirect href="/signin" />;
  }

  if (!canteen) {
    return <ErrorView />;
  }

  return (
    <View>
      <View className="items-center">
        <Text className="text-3xl p-2">{canteen.name}</Text>
      </View>
      <ReviewForm submitReviewForm={submitReviewForm} />

      {errorMessage && <Text className="text-red-500 m-2">{errorMessage}</Text>}
    </View>
  );
}
