import { Stall, Image as ImageType } from "@/app/types";
import ErrorView from "@/components/ErrorView";
import { useGlobalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { Image } from "expo-image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function StallPhotos() {
  const params = useGlobalSearchParams();
  const id = parseInt(params.id as string);

  const router = useRouter();

  const stallCollection = useSelector(
    (state: RootState) => state.stallCollection,
  );

  const stall: Stall | undefined = stallCollection.items.find(
    (stall) => stall.id === id,
  );

  const images = stall?.reviews.flatMap((review) => review.images) ?? [];

  const renderItem = ({ item }: { item: ImageType }) => {
    return (
      <Pressable
        onPress={() => stall && router.push(`../photos/?image_id=${item.id}`)}
      >
        <Image
          source={item.url}
          style={{ width: 200, height: 200 }}
          placeholder="Image not found"
        />
      </Pressable>
    );
  };

  if (stall === undefined) {
    return <ErrorView />;
  }

  return (
    <View className={`p-2 ${images.length > 1 ? "items-center" : ""}`}>
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
