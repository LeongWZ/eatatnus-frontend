import deleteReview from "@/api/reviews/deleteReview";
import fetchIndividualCanteen from "@/api/canteens/fetchIndividualCanteen";
import { Canteen, Review } from "@/app/types";
import ErrorView from "@/components/ErrorView";
import ReviewCard from "@/components/review/ReviewCard";
import AuthContext from "@/contexts/AuthContext";
import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";
import { Link, useGlobalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import getAverageRating from "@/utils/getAverageRating";

export default function CanteenReviews() {
  const params = useGlobalSearchParams();
  const id = parseInt(params.id as string);

  const router = useRouter();

  const { canteenCollection, dispatchCanteenCollectionAction } =
    React.useContext(CanteenCollectionContext);
  const { auth, dispatchAuth } = React.useContext(AuthContext);

  const canteen: Canteen | undefined = canteenCollection.items.find(
    (canteen) => canteen.id === id,
  );

  const onRefresh = () => {
    dispatchCanteenCollectionAction({
      type: "FETCH",
    });

    canteen &&
      fetchIndividualCanteen(canteen.id)
        .then((canteen) =>
          dispatchCanteenCollectionAction({
            type: "PATCH",
            payload: { item: canteen },
          }),
        )
        .catch((error) =>
          dispatchCanteenCollectionAction({
            type: "ERROR",
            payload: { error_message: error },
          }),
        );
  };

  const renderItem = ({ item }: { item: Review }) => (
    <ReviewCard
      review={item}
      user={auth.user}
      onEdit={() => {
        auth.user &&
          router.push(`canteens/reviews/edit/${canteen?.id}/${item.id}`);
      }}
      onDelete={() => {
        auth.user && deleteReview(auth.user, item.id).then(onRefresh);
      }}
      onImagePress={(image) => {
        router.push(`canteens/photos/${canteen?.id}/?image_id=${image.id}`);
      }}
    />
  );

  if (canteen === undefined) {
    return <ErrorView />;
  }

  return (
    <View>
      <View className="flex-row justify-between border-b m-2">
        <View>
          <Text>{canteen.reviews.length} reviews</Text>
          {canteen.reviews.length > 0 && (
            <>
              <Text>Average rating: {getAverageRating(canteen.reviews)}/5</Text>
            </>
          )}
        </View>

        <View className="flex-col justify-center">
          <Link
            href={`canteens/reviews/add/${canteen.id}`}
            className="bg-blue-500"
            asChild
          >
            <Pressable className="p-2">
              <Text className="text-xl">+ Review</Text>
            </Pressable>
          </Link>
        </View>
      </View>
      <FlatList
        data={canteen.reviews.sort((a, b) => (a.id < b.id ? 1 : -1))}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        extraData={canteen}
        contentContainerStyle={{ padding: 12, paddingBottom: 300 }}
        onRefresh={onRefresh}
        refreshing={canteenCollection.loading}
      />
    </View>
  );
}
