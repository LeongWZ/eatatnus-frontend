import { Canteen, Image as ImageType } from "@/app/types";
import ErrorView from "@/components/ErrorView";
import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";
import { useGlobalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { Image } from "expo-image";

export default function CanteenPhotos() {
  const params = useGlobalSearchParams();
  const id = parseInt(params.id as string);

  const router = useRouter();

  const { canteenCollection, dispatchCanteenCollectionAction } =
    React.useContext(CanteenCollectionContext);

  const canteen: Canteen | undefined = canteenCollection.items.find(
    (canteen) => canteen.id === id,
  );

  const images = canteen?.reviews.flatMap((review) => review.images) ?? [];

  const renderItem = ({ item }: { item: ImageType }) => {
    return (
      <Pressable
        onPress={() =>
          canteen &&
          router.push(`canteens/photos/${canteen.id}/?uri=${item.url}`)
        }
      >
        <Image
          source={item.url}
          style={{ width: 200, height: 200 }}
          placeholder="Image not found"
        />
      </Pressable>
    );
  };

  if (canteen === undefined) {
    return <ErrorView />;
  }

  return (
    <View className="p-2">
      {images.length === 0 && <Text>No photos found</Text>}
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        style={{ marginVertical: 8 }}
      />
    </View>
  );
}
