import { Review, Role, Image as ImageType } from "@/app/types";
import { View, Text, FlatList, Pressable } from "react-native";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// @ts-expect-error: No declaration file for module
// eslint-disable-next-line import/no-unresolved
import { HoldItem } from "react-native-hold-menu";

type ReviewProps = {
  review: Review;
  onEdit: () => void;
  onDelete: () => void;
  onImagePress: (image: ImageType) => void;
};

export default function ReviewCard(props: ReviewProps) {
  const { review, onEdit, onDelete, onImagePress } = props;

  const auth = useSelector((state: RootState) => state.auth);
  const user = auth.user;

  const copyToClipboard = () => {
    Clipboard.setStringAsync(`${review.user.name}: ${review.description}`);
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
        <Text>By {review.user.name}</Text>
        <Text>Rating: {review.rating}</Text>
        <Text>Description: {review.description}</Text>
        <FlatList
          data={review.images}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={true}
          style={{ marginVertical: 8 }}
        />
      </View>
    </HoldItem>
  );
}
