import deleteReview from "@/services/reviews/deleteReview";
import fetchReview from "@/services/reviews/fetchReview";
import submitReply from "@/services/reviews/submitReply";
import { RootState } from "@/store";
import {
  errorCanteenCollectionAction,
  loadCanteenCollectionAction,
  patchCanteenCollectionAction,
} from "@/store/reducers/canteenCollection";
import { useGlobalSearchParams, useNavigation, useRouter } from "expo-router";
import React from "react";
import { View, Text, ActivityIndicator, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import deleteReply from "@/services/reviews/deleteReply";
import RepliesView from "@/components/review/RepliesView";

export default function ReviewReplies() {
  const params = useGlobalSearchParams();
  const canteenId = parseInt(params.id as string);
  const reviewId = parseInt(params.reviewId as string);

  const router = useRouter();
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);

  const canteenCollection = useSelector(
    (state: RootState) => state.canteenCollection,
  );

  const canteen = canteenCollection.items.find(
    (canteen) => canteen.id === canteenId,
  );

  const review = canteen?.reviews.find((review) => review.id === reviewId);

  const onRefresh = () => {
    if (canteen && review) {
      dispatch(loadCanteenCollectionAction());
      fetchReview(review.id)
        .then((updatedReview) => {
          dispatch(
            patchCanteenCollectionAction({
              item: {
                ...canteen,
                reviews: canteen.reviews.map((review) =>
                  review.id === reviewId ? updatedReview : review,
                ),
              },
            }),
          );
        })
        .catch((error: Error) => {
          dispatch(
            errorCanteenCollectionAction({
              errorMessage: error.message,
            }),
          );
          Alert.alert("Failed to fetch review: " + error.message);
        });
    }
  };

  React.useEffect(() => {
    if (!auth.isAuthenticated) {
      Alert.alert("Sign In Required", "You need to sign in to reply");
    }
  }, [auth]);

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
        auth.isAuthenticated &&
          deleteReview(review.id)
            .then(() => {
              if (canteen) {
                dispatch(
                  patchCanteenCollectionAction({
                    item: {
                      ...canteen,
                      reviews: canteen.reviews.filter(
                        (review) => review.id !== review.id,
                      ),
                    },
                  }),
                );
              }
            })
            .then(router.back);
      }}
      onReviewEdit={() => {
        auth.isAuthenticated && router.push(`./edit`);
      }}
      submitReply={(body, parentId) => {
        submitReply(review.id, { body: body, replyId: parentId })
          .then(() => {
            if (params.autofocus !== undefined) {
              router.setParams({ autofocus: undefined });
            }
            onRefresh();
          })
          .catch((error) => Alert.alert(error.message));
      }}
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
