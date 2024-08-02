import fetchIndividualCanteen from "@/services/canteens/fetchIndividualCanteen";
import { Canteen } from "@/app/types";
import ErrorView from "@/components/ErrorView";
import { MaterialTopTabs } from "@/components/tabs/MaterialTopTabs";
import { RootState } from "@/store";
import {
  errorCanteenCollectionAction,
  loadCanteenCollectionAction,
  patchCanteenCollectionAction,
} from "@/store/reducers/canteenCollection";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function CanteensLayout() {
  const params = useLocalSearchParams();
  const id = parseInt(params.id as string);

  const dispatch = useDispatch();

  const canteenCollection = useSelector(
    (state: RootState) => state.canteenCollection,
  );

  const canteen: Canteen | undefined = canteenCollection.items.find(
    (canteen) => canteen.id === id,
  );

  const navigation = useNavigation();

  React.useEffect(() => {
    if (canteen === undefined) {
      return;
    }

    navigation.setOptions({
      title: canteen.name,
    });

    const images = canteen.reviews.flatMap((review) => review.images);

    if (images.some((image) => image.url === undefined)) {
      dispatch(loadCanteenCollectionAction());
      fetchIndividualCanteen(canteen.id)
        .then((canteen) =>
          dispatch(patchCanteenCollectionAction({ item: canteen })),
        )
        .catch((error) =>
          dispatch(
            errorCanteenCollectionAction({
              errorMessage: "Failed to fetch canteen: " + error,
            }),
          ),
        );
    }
  }, []);

  if (canteen === undefined) {
    return <ErrorView />;
  }

  return (
    <MaterialTopTabs>
      <MaterialTopTabs.Screen
        name="about"
        options={{
          title: "About",
        }}
      />
      <MaterialTopTabs.Screen
        name="reviews"
        options={{
          title: "Reviews",
        }}
      />
      <MaterialTopTabs.Screen
        name="photos"
        options={{
          title: "Photos",
        }}
      />
    </MaterialTopTabs>
  );
}
