import { Stall, Image as ImageType, Canteen } from "@/app/types";
import ErrorView from "@/components/ErrorView";
import StallCollectionContext from "@/contexts/StallCollectionContext";
import { useGlobalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, Text, Pressable, FlatList, ScrollView } from "react-native";
import { Image } from "expo-image";
import isMenu from "@/api/firebase-functions/isMenu";
import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";

export default function StallAbout() {
  const params = useGlobalSearchParams();
  const id = parseInt(params.id as string);

  const router = useRouter();

  const { stallCollection } = React.useContext(StallCollectionContext);

  const stall: Stall | undefined = stallCollection.items.find(
    (stall) => stall.id === id,
  );

  const { canteenCollection } = React.useContext(CanteenCollectionContext);

  const canteen: Canteen | undefined = canteenCollection.items.find(
    (canteen) => canteen.id === stall?.canteenId,
  );

  const renderItem = ({ item }: { item: ImageType }) => {
    return (
      <Pressable
        onPress={() =>
          stall && router.push(`stalls/photos/${stall.id}/?uri=${item.url}`)
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

  const [menuImages, setMenuImages] = React.useState<ImageType[]>([]);

  React.useEffect(() => {
    if (stall === undefined) {
      return;
    }

    const setMenuImagesAsync = async () => {
      const images = stall.reviews.flatMap((review) => review.images);

      const menuImages = await getMenuImages(images);
      setMenuImages(menuImages);
    };

    setMenuImagesAsync();
  }, [stall]);

  if (stall === undefined) {
    return <ErrorView />;
  }

  return (
    <ScrollView className="p-2">
      <View>
        <Text className="text-4xl">{stall.name}</Text>
        <Text className="text-xl mb-2">{canteen?.name}</Text>
      </View>

      <View>
        <Text className="text-2xl">Menu</Text>
        <Text>
          Contribute by submitting a review along with an image of a menu.
        </Text>
        {menuImages.length === 0 && <Text>No menu found.</Text>}
        <FlatList
          data={menuImages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={true}
          style={{ marginVertical: 8, marginLeft: 8 }}
        />
      </View>
    </ScrollView>
  );
}

async function getMenuImages(images: ImageType[]): Promise<ImageType[]> {
  if (images.length === 0) {
    return [];
  }

  return Promise.all(
    images.map(async (image) => {
      if (image.url && (await isMenu(image.url))) {
        return image;
      }
      return null;
    }),
  ).then((images) => images.flatMap((image) => (image ? [image] : [])));
}
