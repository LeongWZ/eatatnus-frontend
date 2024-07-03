import fetchIndividualStall from "@/api/stalls/fetchIndividualStall";
import { Stall } from "@/app/types";
import ErrorView from "@/components/ErrorView";
import { MaterialTopTabs } from "@/components/tabs/MaterialTopTabs";
import StallCollectionContext from "@/contexts/StallCollectionContext";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";

export default function StallsLayout() {
  const params = useLocalSearchParams();
  const id = parseInt(params.id as string);

  const { stallCollection, dispatchStallCollectionAction } = React.useContext(
    StallCollectionContext,
  );

  const stall: Stall | undefined = stallCollection.items.find(
    (stall) => stall.id === id,
  );

  const navigation = useNavigation();

  const onRefresh = () => {
    if (stall === undefined) {
      return;
    }

    dispatchStallCollectionAction({ type: "FETCH" });
    fetchIndividualStall(stall.id)
      .then((stall) =>
        dispatchStallCollectionAction({
          type: "PATCH",
          payload: { item: stall },
        }),
      )
      .catch((error) =>
        dispatchStallCollectionAction({
          type: "ERROR",
          payload: { error_message: error },
        }),
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
