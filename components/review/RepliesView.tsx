import { Image, Reply, Review } from "@/app/types";
import ReplyCard from "./ReplyCard";
import React from "react";
import { SectionList, TouchableOpacity, View, Text, Alert } from "react-native";
import ReviewCard from "./ReviewCard";
import ReplyInput from "./ReplyInput";
import { Auth } from "@/store/reducers/auth";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Keyboard } from "react-native";

type RepliesViewProps = {
  review: Review;
  auth: Auth;
  autoFocus?: boolean;
  onRefresh: () => void;
  onReviewEdit: () => void;
  onReviewDelete: () => void;
  onImagePress: (image: Image) => void;
  deleteReply: (replyId: number) => void;
  submitReply: (body: string, parentId?: number) => void;
};

export default function RepliesView(props: RepliesViewProps) {
  const {
    review,
    auth,
    autoFocus,
    onRefresh,
    onImagePress,
    onReviewDelete,
    onReviewEdit,
    submitReply,
    deleteReply,
  } = props;

  const [parentId, setParentId] = React.useState<number | undefined>(undefined);

  const renderReply = ({ item }: { item: Reply }) => (
    <ReplyCard
      reply={item}
      user={auth.user}
      parentReply={
        item.parentId
          ? review.replies.find((reply) => reply.id === item.parentId)
          : undefined
      }
      onDelete={() => deleteReply(item.id)}
      onReply={() => {
        setParentId(item.id);
        if (!auth.isAuthenticated) {
          Alert.alert("Sign In Required", "Please sign in to post a reply.");
        }
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
                onEdit={onReviewEdit}
                onDelete={onReviewDelete}
                onImagePress={onImagePress}
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
      {auth.isAuthenticated && parentId !== undefined && (
        <>
          <View className="flex-row items-center space-x-2 mt-2">
            <Text className="text-lg">
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
            submitReply={(body) => {
              if (body.length > 0) {
                submitReply(body, parentId);
                setParentId(undefined);
                Keyboard.dismiss();
              }
            }}
            autoFocus={true}
          />
        </>
      )}
      {auth.isAuthenticated && !parentId && (
        <ReplyInput
          submitReply={(body) => {
            if (body.length > 0) {
              submitReply(body, parentId);
              setParentId(undefined);
              Keyboard.dismiss();
            }
          }}
          autoFocus={autoFocus}
        />
      )}
    </View>
  );
}
