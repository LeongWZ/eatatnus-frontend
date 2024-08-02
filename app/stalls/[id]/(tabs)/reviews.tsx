import React from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { Link, useGlobalSearchParams, useRouter } from "expo-router";
import ErrorView from "@/components/ErrorView";
import { Stall, Image } from "@/app/types";
import ReviewCard from "@/components/review/ReviewCard";
import fetchIndividualStall from "@/services/stalls/fetchIndividualStall";
import deleteReview from "@/services/reviews/deleteReview";
import getAverageRating from "@/utils/getAverageRating";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  loadStallCollectionAction,
  patchStallCollectionAction,
  errorStallCollectionAction,
} from "@/store/reducers/stallCollection";
import { Rating } from "@kolking/react-native-rating";

export default function StallReviews() {
  const params = useGlobalSearchParams();
  const id = parseInt(params.id as string);

  const router = useRouter();
  const dispatch = useDispatch();

  const stallCollection = useSelector(
    (state: RootState) => state.stallCollection,
  );

  const auth = useSelector((state: RootState) => state.auth);

  const stall: Stall | undefined = stallCollection.items.find(
    (stall) => stall.id === id,
  );

  const reviewCount = stall?.reviews.length ?? 0;

  const averageRating = getAverageRating(stall?.reviews ?? []);

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

  if (stall === undefined) {
    return <ErrorView />;
  }

  return (
    <>
      <View className="flex-row justify-between border-b p-2">
        <View>
          <Text>{reviewCount} reviews</Text>
          <View className="flex-row space-x-2">
            <Text className="text-base">{averageRating}</Text>
            <Rating maxRating={5} rating={averageRating} size={18} disabled />
          </View>
        </View>

        <View className="flex-col justify-center">
          <Link href={`../reviews/add`} className="bg-blue-500" asChild>
            <Pressable className="p-2">
              <Text className="text-xl">+ Review</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      <View className="mx-3">
        <FlatList
          data={stall.reviews}
          renderItem={({ item }) => (
            <ReviewCard
              review={item}
              user={auth.user}
              onEdit={() => {
                router.push(`../reviews/edit/${item.id}`);
              }}
              onDelete={() => {
                auth.isAuthenticated && deleteReview(item.id).then(onRefresh);
              }}
              onImagePress={(image: Image) => {
                router.push(`../photos/?image_id=${image.id}`);
              }}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          extraData={stall}
          contentContainerStyle={{ paddingBottom: 300 }}
          onRefresh={onRefresh}
          refreshing={stallCollection.loading}
        />
      </View>
    </>
  );
}
