import deleteReview from "@/services/reviews/deleteReview";
import fetchIndividualCanteen from "@/services/canteens/fetchIndividualCanteen";
import { Canteen, Review } from "@/app/types";
import ErrorView from "@/components/ErrorView";
import ReviewCard from "@/components/review/ReviewCard";
import {
  loadCanteenCollectionAction,
  patchCanteenCollectionAction,
  errorCanteenCollectionAction,
} from "@/store/reducers/canteenCollection";
import { Link, useGlobalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  TouchableOpacity,
} from "react-native";
import getAverageRating from "@/utils/getAverageRating";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { Rating } from "@kolking/react-native-rating";

export default function CanteenReviews() {
  const params = useGlobalSearchParams();
  const id = parseInt(params.id as string);

  const router = useRouter();
  const dispatch = useDispatch();

  const canteenCollection = useSelector(
    (state: RootState) => state.canteenCollection,
  );

  const auth = useSelector((state: RootState) => state.auth);

  const canteen: Canteen | undefined = canteenCollection.items.find(
    (canteen) => canteen.id === id,
  );

  const reviewCount = canteen?.reviews.length ?? 0;
  const averageRating = getAverageRating(canteen?.reviews ?? []);

  const onRefresh = () => {
    dispatch(loadCanteenCollectionAction());

    canteen &&
      fetchIndividualCanteen(canteen.id)
        .then((canteen) =>
          dispatch(patchCanteenCollectionAction({ item: canteen })),
        )
        .catch((error) =>
          dispatch(
            errorCanteenCollectionAction({
              errorMessage: "Failed to fetch canteen: " + error,
            }),
          ),
        );
  };

  const renderItem = ({ item }: { item: Review }) => (
    <View>
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
      />
      <View className="flex-row items-start border">
        {item.replies.length > 0 && (
          <Link href={`../reviews/${item.id}`} asChild>
            <TouchableOpacity className="border rounded m-2 p-2">
              <Text>View {item.replies.length} replies</Text>
            </TouchableOpacity>
          </Link>
        )}
        <Link href={`../reviews/${item.id}/?autofocus`} asChild>
          <TouchableOpacity className="border rounded m-2 p-2">
            <Text>Reply</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );

  if (canteen === undefined) {
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
          <Link href={`../reviews/add`} className="bg-blue-500" asChild>
            <Pressable className="p-2">
              <Text className="text-xl">+ Review</Text>
            </Pressable>
          </Link>
        </View>
      </View>
      <FlatList
        data={canteen.reviews}
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
