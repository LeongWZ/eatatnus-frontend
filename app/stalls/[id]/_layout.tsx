import fetchIndividualStall from "@/api/stalls/fetchIndividualStall";
import { Stall } from "@/app/types";
import ErrorView from "@/components/ErrorView";
import { MaterialTopTabs } from "@/components/tabs/MaterialTopTabs";
import { RootState } from "@/store";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadStallCollectionAction,
  patchStallCollectionAction,
  errorStallCollectionAction,
} from "@/store/reducers/stallCollection";

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
    if (stall === undefined) {
      return;
    }

    navigation.setOptions({
      title: stall.name,
    });

    onRefresh();
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
