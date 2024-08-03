import submitReview from "@/services/stalls/submitReview";
import ErrorView from "@/components/ErrorView";
import ReviewForm, { FormData } from "@/components/review/ReviewForm";
import { RootState } from "@/store";
import {
  Redirect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  loadStallCollectionAction,
  patchStallCollectionAction,
} from "@/store/reducers/stallCollection";
import fetchReview from "@/services/reviews/fetchReview";

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
        .then((res) => fetchReview(res.id))
        .then((updatedReview) => {
          setErrorMessage(null);
          if (stall) {
            dispatch(loadStallCollectionAction());
            dispatch(
              patchStallCollectionAction({
                item: {
                  ...stall,
                  reviews: [updatedReview, ...(stall?.reviews ?? [])],
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
      title: "Add Review",
    });
  }, [navigation]);

  if (!auth.isAuthenticated) {
    return <Redirect href="/signin" />;
  }

  if (stall === undefined) {
    return <ErrorView />;
  }

  return (
    <View className="p-2">
      <View className="items-center">
        <Text className="text-3xl p-4">{stall.name}</Text>
      </View>

      <ReviewForm submitReviewForm={submitReviewForm} />

      {errorMessage && <Text className="text-red-500 m-2">{errorMessage}</Text>}
    </View>
  );
}
