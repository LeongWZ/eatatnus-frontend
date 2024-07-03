import { Stall, Image as ImageType, Canteen } from "@/app/types";
import ErrorView from "@/components/ErrorView";
import StallCollectionContext from "@/contexts/StallCollectionContext";
import { Link, useGlobalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import getMenuImages from "@/api/firebase-functions/getMenuImages";
import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";
import useIdentifiableCollectionReducer from "@/hooks/useIdentifiableCollectionReducer";
import AuthContext from "@/contexts/AuthContext";

export default function StallAbout() {
  const params = useGlobalSearchParams();
  const id = parseInt(params.id as string);

  const router = useRouter();

  const { auth } = React.useContext(AuthContext);

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
          stall && router.push(`stalls/photos/${stall.id}/?image_id=${item.id}`)
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

  const images = stall?.reviews.flatMap((review) => review.images) ?? [];

  const [menuImages, dispatcheMenuImagesAction] =
    useIdentifiableCollectionReducer<ImageType>({
      items: [],
      loading: false,
      error_message: "",
    });

  React.useEffect(() => {
    setMenuImagesAsync();

    async function setMenuImagesAsync() {
      if (menuImages.loading || images.length === 0 || !auth.user) {
        // prevent race condition or do not process empty array
        // or do not process if user is not authenticated
        return;
      }

      dispatcheMenuImagesAction({ type: "FETCH" });

      try {
        const menuImages = await getMenuImages(images);
        dispatcheMenuImagesAction({
          type: "PUT",
          payload: { items: menuImages },
        });
      } catch (error) {
        console.error(error);
        dispatcheMenuImagesAction({
          type: "ERROR",
          payload: {
            error_message: error instanceof Error ? error.message : `${error}`,
          },
        });
      }
    }
  }, [images]);

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
        {!auth.user && (
          <View className="items-center border-dashed border-2 border-red-500 p-2 m-4 ">
            <Text className="p-4">
              Only signed in users may view menu images
            </Text>
            <Link href={`signin`} className="bg-blue-500" asChild>
              <Pressable className="p-2">
                <Text className="text-xl">Sign in</Text>
              </Pressable>
            </Link>
          </View>
        )}
        {!menuImages.loading && menuImages.items.length === 0 && auth.user && (
          <View className="items-center">
            <Text className="p-4">No menu found.</Text>
          </View>
        )}
        {menuImages.loading && menuImages.items.length === 0 && (
          <ActivityIndicator className="my-4" />
        )}
        <FlatList
          data={menuImages.items}
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
