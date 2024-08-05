import deleteReview from "@/services/reviews/deleteReview";
import fetchReview from "@/services/reviews/fetchReview";
import submitReply from "@/services/reviews/submitReply";
import { RootState } from "@/store";
import {
  errorStallCollectionAction,
  loadStallCollectionAction,
  patchStallCollectionAction,
} from "@/store/reducers/stallCollection";
import { useGlobalSearchParams, useNavigation, useRouter } from "expo-router";
import React from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import deleteReply from "@/services/reviews/deleteReply";
import RepliesView from "@/components/review/RepliesView";

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

  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.setOptions({
      title: "Review Replies",
    });
  }, [navigation]);

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

  return (
    <RepliesView
      review={review}
      auth={auth}
      autoFocus={params.autofocus !== undefined}
      onRefresh={onRefresh}
      onImagePress={(image) => {
        router.push(`../../photos/?image_id=${image.id}`);
      }}
      onReviewDelete={() => {
        if (auth.isAuthenticated) {
          deleteReview(review.id)
            .then(() => {
              if (stall) {
                dispatch(
                  patchStallCollectionAction({
                    item: {
                      ...stall,
                      reviews: stall.reviews.filter(
                        (review) => review.id !== review.id,
                      ),
                    },
                  }),
                );
              }
            })
            .then(router.back);
        }
      }}
      onReviewEdit={() => {
        auth.isAuthenticated && router.push(`./edit`);
      }}
      submitReply={(body, parentId) =>
        submitReply(review.id, { body: body, replyId: parentId })
          .then(() => {
            if (params.autofocus !== undefined) {
              router.setParams({ autofocus: undefined });
            }
            onRefresh();
          })
          .catch((error) => Alert.alert(error.message))
      }
      deleteReply={(replyId) =>
        deleteReply(replyId)
          .then(() => {
            if (params.autofocus !== undefined) {
              router.setParams({ autofocus: undefined });
            }
            onRefresh();
          })
          .catch((error) => Alert.alert(error.message))
      }
    />
  );
}
