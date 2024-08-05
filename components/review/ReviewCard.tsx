import { Review, Role, Image as ImageType, User } from "@/app/types";
import {
  View,
  Text,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import UserPressable from "../users/UserPressable";
import { Rating } from "@kolking/react-native-rating";
import Markdown from "react-native-markdown-display";

// @ts-expect-error: No declaration file for module
// eslint-disable-next-line import/no-unresolved
import { HoldItem } from "react-native-hold-menu";

type ReviewProps = {
  review: Review;
  user: User | null;
  onEdit: () => void;
  onDelete: () => void;
  onImagePress: (image: ImageType) => void;
  onViewReplies?: () => void;
  onReply?: () => void;
};

export default function ReviewCard(props: ReviewProps) {
  const {
    review,
    user,
    onEdit,
    onDelete,
    onImagePress,
    onViewReplies,
    onReply,
  } = props;

  const router = useRouter();

  const localeString: string = new Date(review.createdAt).toLocaleString();

  const copyToClipboard = () => {
    Clipboard.setStringAsync(`${review.description}`);
  };

  const MenuItems = [
    { text: "Copy", icon: "copy", onPress: copyToClipboard },
    ...(user?.id === review.userId || user?.role === Role.Admin
      ? [
          { text: "Edit", icon: "edit", onPress: onEdit },
          {
            text: "Delete",
            icon: "trash",
            isDestructive: true,
            onPress: onDelete,
          },
        ]
      : []),
  ];

  const renderItem = ({ item }: { item: ImageType }) => {
    return (
      <Pressable onPress={() => onImagePress(item)}>
        <Image
          source={item.url}
          style={{ width: 200, height: 200 }}
          placeholder="Image not found"
        />
      </Pressable>
    );
  };

  return (
    <HoldItem items={MenuItems}>
      <View className="border mt-2 p-2 bg-white">
        <View className="items-start">
          {review.user !== null ? (
            <UserPressable
              user={review.user}
              onPress={() => router.push(`/users/${review.user?.id}`)}
            />
          ) : (
            <Text>Deleted user</Text>
          )}
        </View>
        <Text className="my-2">{localeString}</Text>
        <Rating
          size={20}
          rating={review.rating}
          onChange={() => {}}
          disabled={true}
          style={{ paddingVertical: 4 }}
        />
        <View className="my-2">
          <Markdown>{review.description ?? ""}</Markdown>
        </View>
        <FlatList
          data={review.images}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={true}
          style={{ marginVertical: 8 }}
        />
        <View className="flex-row items-start space-x-4">
          {review.replies.length > 0 && onViewReplies && (
            <TouchableOpacity onPress={onViewReplies}>
              <Text className="text-lg text-blue-800">
                View {review.replies.length} replies
              </Text>
            </TouchableOpacity>
          )}
          {onReply && (
            <TouchableOpacity onPress={onReply}>
              <Text className="text-lg text-blue-800">Reply</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </HoldItem>
  );
}
