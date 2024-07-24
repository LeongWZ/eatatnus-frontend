import { Stall } from "@/app/types";
import ErrorView from "@/components/ErrorView";
import { MaterialTopTabs } from "@/components/tabs/MaterialTopTabs";
import { RootState } from "@/store";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { useSelector } from "react-redux";

export default function StallsLayout() {
  const params = useLocalSearchParams();
  const id = parseInt(params.id as string);

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
