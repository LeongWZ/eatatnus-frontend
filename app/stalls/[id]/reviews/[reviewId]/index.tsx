import { Reply } from "@/app/types";
import ReplyCard from "@/components/review/ReplyCard";
import ReviewCard from "@/components/review/ReviewCard";
import deleteReview from "@/services/reviews/deleteReview";
import fetchReview from "@/services/reviews/fetchReview";
import submitReply from "@/services/reviews/submitReply";
import { RootState } from "@/store";
import {
  errorStallCollectionAction,
  loadStallCollectionAction,
  patchStallCollectionAction,
} from "@/store/reducers/stallCollection";
import { useGlobalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  ActivityIndicator,
  Alert,
  SectionList,
  TouchableOpacity,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import deleteReply from "@/services/reviews/deleteReply";
import ReplyInput from "@/components/review/ReplyInput";
import AntDesign from "@expo/vector-icons/AntDesign";

export default function ReviewReplies() {
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

  const [parentId, setParentId] = React.useState<number | undefined>(undefined);

  const onRefresh = () => {
    if (stall && review) {
      dispatch(loadStallCollectionAction());
      fetchReview(review.id)
        .then((updatedReview) => {
          dispatch(
            patchStallCollectionAction({
              item: {
                ...stall,
                reviews: stall.reviews.map((review) =>
                  review.id === reviewId ? updatedReview : review,
                ),
              },
            }),
          );
        })
        .catch((error: Error) => {
          dispatch(
            errorStallCollectionAction({
              errorMessage: error.message,
            }),
          );
          Alert.alert("Failed to fetch review: " + error.message);
        });
    }
  };

  React.useEffect(() => {
    if (
      review?.replies.some(
        (reply) => reply.user?.profile?.image?.url === undefined,
      )
    ) {
      onRefresh();
    }
  }, []);

  if (!review) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderReply = ({ item }: { item: Reply }) => (
    <ReplyCard
      reply={item}
      user={auth.user}
      parentReply={
        item.parentId
          ? review.replies.find((reply) => reply.id === item.parentId)
          : undefined
      }
      onDelete={() =>
        deleteReply(item.id)
          .then(onRefresh)
          .catch((error) => Alert.alert(error.message))
      }
      onReply={() => {
        setParentId(item.id);
      }}
      key={item.id}
    />
  );

  return (
    <View className="flex-1 p-2 pb-1">
      <SectionList
        refreshing={false}
        onRefresh={onRefresh}
        contentContainerStyle={{ paddingBottom: 100 }}
        sections={[
          {
            data: [
              // dummy data to make the section list work
              {
                id: NaN,
                createdAt: "",
                updatedAt: "",
                body: "",
                user: null,
                userId: NaN,
                reviewId: review.id,
                parentId: null,
              },
            ],
            renderItem: ({ item }) => (
              <ReviewCard
                review={review}
                user={auth.user}
                onEdit={() => {
                  auth.isAuthenticated && router.push(`./edit`);
                }}
                onDelete={() => {
                  auth.isAuthenticated &&
                    deleteReview(review.id).then(router.back);
                }}
                onImagePress={(image) => {
                  router.push(`../../photos/?image_id=${image.id}`);
                }}
              />
            ),
          },
          {
            data: review.replies,
            renderItem: renderReply,
            title: `${review.replies.length} Replies`,
          },
        ]}
        renderSectionHeader={({ section: { title } }) =>
          title && <Text className="text-xl mt-2">{title}</Text>
        }
        keyExtractor={(item, index) => item.id.toString() + index}
      />
      {parentId !== undefined ? (
        <>
          <View className="flex-row items-center space-x-1 mt-2">
            <Text className="text-xl">
              Reply to{" "}
              {
                review?.replies.find((reply) => reply.id === parentId)?.user
                  ?.name
              }
            </Text>
            <TouchableOpacity onPress={() => setParentId(undefined)}>
              <AntDesign name="closecircleo" size={24} color="red" />
            </TouchableOpacity>
          </View>
          <ReplyInput
            submitReply={(body) =>
              submitReply(review.id, { replyId: parentId, body: body })
                .then(() => setParentId(undefined))
                .then(onRefresh)
                .catch(console.error)
            }
            autoFocus={true}
          />
        </>
      ) : (
        <ReplyInput
          submitReply={(body) =>
            submitReply(review.id, { body: body })
              .then(() => setParentId(undefined))
              .then(onRefresh)
              .catch((error) => Alert.alert(error.message))
          }
          autoFocus={params.autofocus !== undefined}
        />
      )}
    </View>
  );
}
