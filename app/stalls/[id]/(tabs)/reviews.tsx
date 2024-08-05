import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { Link, useGlobalSearchParams, useRouter } from "expo-router";
import ErrorView from "@/components/ErrorView";
import { Stall, Review } from "@/app/types";
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

  const renderItem = ({ item }: { item: Review }) => (
    <ReviewCard
      review={item}
      user={auth.user}
      onEdit={() => {
        auth.isAuthenticated && router.push(`../reviews/${item.id}/edit`);
      }}
      onDelete={() => {
        auth.isAuthenticated && deleteReview(item.id).then(onRefresh);
      }}
      onImagePress={(image) => {
        router.push(`../photos/?image_id=${image.id}`);
      }}
      onViewReplies={() => router.push(`../reviews/${item.id}`)}
      onReply={() => router.push(`../reviews/${item.id}/?autofocus`)}
    />
  );

  if (stall === undefined) {
    return <ErrorView />;
  }

  return (
    <View>
      <View className="flex-row justify-between border-b p-2">
        <View>
          <Text>{reviewCount} reviews</Text>
          <View className="flex-row space-x-2">
            <Text className="text-base">{averageRating}</Text>
            <Rating maxRating={5} rating={averageRating} size={18} disabled />
          </View>
        </View>

        <View className="flex-col justify-center">
          <Link href={`../reviews/add`} asChild>
            <TouchableOpacity
              className="p-2 border rounded"
              style={{ backgroundColor: "rgb(220 38 38)" }}
            >
              <Text className="text-xl text-white">+ Review</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <FlatList
        data={stall.reviews}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        extraData={stall}
        contentContainerStyle={{ padding: 8, paddingBottom: 300 }}
        onRefresh={onRefresh}
        refreshing={stallCollection.loading}
        ListEmptyComponent={<Text>No reviews yet</Text>}
      />
    </View>
  );
}
