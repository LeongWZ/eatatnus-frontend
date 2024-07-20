import React from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { Link, useGlobalSearchParams, useRouter } from "expo-router";
import ErrorView from "@/components/ErrorView";
import { Stall, Image } from "@/app/types";
import ReviewCard from "@/components/review/ReviewCard";
import fetchIndividualStall from "@/api/stalls/fetchIndividualStall";
import deleteReview from "@/api/reviews/deleteReview";
import getAverageRating from "@/utils/getAverageRating";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  loadStallCollectionAction,
  patchStallCollectionAction,
  errorStallCollectionAction,
} from "@/store/reducers/stallCollection";

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
          {reviewCount > 0 && <Text>Average rating: {averageRating}/5</Text>}
        </View>

        <View className="flex-col justify-center">
          <Link
            href={`stalls/reviews/add/${stall.id}`}
            className="bg-blue-500"
            asChild
          >
            <Pressable className="p-2">
              <Text className="text-xl">+ Review</Text>
            </Pressable>
          </Link>
        </View>
      </View>

      <View className="mx-3">
        <FlatList
          data={[...stall.reviews].sort((a, b) => (a.id < b.id ? 1 : -1))}
          renderItem={({ item }) => (
            <ReviewCard
              review={item}
              onEdit={() => {
                router.push(`stalls/reviews/edit/${stall.id}/${item.id}`);
              }}
              onDelete={() => {
                auth.isAuthenticated && deleteReview(item.id).then(onRefresh);
              }}
              onImagePress={(image: Image) => {
                router.push(`stalls/photos/${stall.id}/?image_id=${image.id}`);
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
