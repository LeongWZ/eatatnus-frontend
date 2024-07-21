import { Stall, Image as ImageType, Canteen, Role, Food } from "@/app/types";
import ErrorView from "@/components/ErrorView";
import { useGlobalSearchParams, useRouter } from "expo-router";
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
import useIdentifiableCollectionReducer from "@/hooks/useIdentifiableCollectionReducer";
import getMenuImagesAsync from "@/api/firebase-functions/getMenuImagesAsync";
import FoodView from "@/components/menu/FoodView";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import AddFoodView from "@/components/menu/AddFoodView";
import updateMenu from "@/api/menus/updateMenu";
import fetchIndividualStall from "@/api/stalls/fetchIndividualStall";
import {
  errorStallCollectionAction,
  loadStallCollectionAction,
  patchStallCollectionAction,
} from "@/store/reducers/stallCollection";
import createMenu from "@/api/menus/createMenu";

export default function StallAbout() {
  const params = useGlobalSearchParams();
  const id = parseInt(params.id as string);

  const router = useRouter();
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);

  const stallCollection = useSelector(
    (state: RootState) => state.stallCollection,
  );

  const stall: Stall | undefined = stallCollection.items.find(
    (stall) => stall.id === id,
  );

  const canteenCollection = useSelector(
    (state: RootState) => state.canteenCollection,
  );

  const canteen: Canteen | undefined = canteenCollection.items.find(
    (canteen) => canteen.id === stall?.canteenId,
  );

  const [menuImages, dispatchMenuImagesAction] =
    useIdentifiableCollectionReducer<ImageType>({
      items: [],
      loading: false,
      errorMessage: "",
    });

  const menuFoodItems = [...(stall?.menu?.items ?? [])].sort(
    (a, b) => b.id - a.id,
  );

  const renderMenuImage = ({ item }: { item: ImageType }) => {
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

  const onRefresh = () => {
    if (stall === undefined) {
      return;
    }

    dispatch(loadStallCollectionAction());
    fetchIndividualStall(stall.id)
      .then((stall) => dispatch(patchStallCollectionAction({ item: stall })))
      .catch((error) =>
        dispatch(
          errorStallCollectionAction({
            errorMessage: "Failed to fetch stall: " + error,
          }),
        ),
      );
  };

  React.useEffect(() => {
    setMenuImagesAsync();

    async function setMenuImagesAsync() {
      if (menuImages.loading) {
        // prevent race condition or do not process empty array
        return;
      }

      dispatchMenuImagesAction({ type: "LOAD" });

      try {
        const images = stall?.reviews.flatMap((review) => review.images) ?? [];
        const menuImages = await getMenuImagesAsync(images);

        dispatchMenuImagesAction({
          type: "PUT",
          payload: { items: menuImages },
        });
      } catch (error) {
        console.error(error);
        dispatchMenuImagesAction({
          type: "ERROR",
          payload: {
            errorMessage: error instanceof Error ? error.message : `${error}`,
          },
        });
      }
    }
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

      <View className="pb-52">
        <Text className="text-2xl">Menu</Text>

        <Text>
          Contribute by submitting a review along with an image of a menu.
        </Text>

        {!menuImages.loading &&
          !stall.menu &&
          menuImages.items.length === 0 && (
            <View className="items-center">
              <Text className="p-4">No menu found.</Text>
            </View>
          )}

        {menuImages.loading && menuImages.items.length === 0 && (
          <ActivityIndicator className="my-4" />
        )}

        <FlatList
          data={menuImages.items}
          renderItem={renderMenuImage}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={true}
          style={{ marginVertical: 8, marginLeft: 8 }}
        />
        {(auth.user?.id === stall.ownerId ||
          auth.user?.role === Role.Admin) && (
          <AddFoodView submitCreate={addFoodFn(stall, onRefresh)} />
        )}
        {menuFoodItems.map((item) => (
          <FoodView
            food={item}
            ownerId={stall.ownerId}
            submitDelete={deleteFoodFn(stall, onRefresh)}
            submitEdit={editFoodFn(stall, onRefresh)}
            key={item.id}
          />
        ))}
      </View>
    </ScrollView>
  );
}

function editFoodFn(stall?: Stall, next?: () => void) {
  return (food: Food) => {
    if (!stall?.menu) {
      return;
    }

    updateMenu(
      stall.menu.id,
      stall.menu.items.map((item) => (item.id === food.id ? food : item)),
    )
      .then(next)
      .catch(console.error);
  };
}

function deleteFoodFn(stall?: Stall, next?: () => void) {
  return (food: Food) => {
    if (!stall?.menu) {
      return;
    }

    updateMenu(
      stall.menu.id,
      stall?.menu.items.filter((item) => item.id !== food.id),
    )
      .then(next)
      .catch(console.error);
  };
}

function addFoodFn(stall?: Stall, next?: () => void) {
  return (food: Omit<Food, "id">) => {
    if (stall?.menu) {
      updateMenu(stall.menu.id, [...stall?.menu.items, food])
        .then(next)
        .catch(console.error);
    } else if (stall) {
      createMenu(stall.id, [food]).then(next).catch(console.error);
    }
  };
}
