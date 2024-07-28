import fetchIndividualStall from "@/services/stalls/fetchIndividualStall";
import { Stall } from "@/app/types";
import ErrorView from "@/components/ErrorView";
import { MaterialTopTabs } from "@/components/tabs/MaterialTopTabs";
import { RootState } from "@/store";
import {
  errorStallCollectionAction,
  loadStallCollectionAction,
  patchStallCollectionAction,
} from "@/store/reducers/stallCollection";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function StallsLayout() {
  const params = useLocalSearchParams();
  const id = parseInt(params.id as string);

  const dispatch = useDispatch();

  const stallCollection = useSelector(
    (state: RootState) => state.stallCollection,
  );

  const stall: Stall | undefined = stallCollection.items.find(
    (stall) => stall.id === id,
  );

  const navigation = useNavigation();

  React.useEffect(() => {
    if (stall === undefined) {
      return;
    }

    navigation.setOptions({
      title: stall.name,
    });

    const images = stall.reviews.flatMap((review) => review.images);

    if (images.some((image) => image.url === undefined)) {
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
    }
  }, []);

  if (stall === undefined) {
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
