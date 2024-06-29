import { Canteen, Stall } from "@/app/types";
import ErrorView from "@/components/ErrorView";
import { MaterialTopTabs } from "@/components/tabs/MaterialTopTabs";
import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";
import StallCollectionContext from "@/contexts/StallCollectionContext";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text } from "react-native";

export default function StallsLayout() {
  const params = useLocalSearchParams();
  const id = parseInt(params.id as string);

  const { stallCollection, dispatchStallCollectionAction } = React.useContext(
    StallCollectionContext,
  );
  const { canteenCollection, dispatchCanteenCollectionAction } =
    React.useContext(CanteenCollectionContext);

  const stall: Stall | undefined = stallCollection.items.find(
    (stall) => stall.id === id,
  );

  if (stall === undefined) {
    return <ErrorView />;
  }

  const canteen: Canteen | undefined = canteenCollection.items.find(
    (canteen) => canteen.id === stall.canteenId,
  );

  return (
    <>
      <View className="p-2">
        <Text className="text-4xl">{stall.name}</Text>
        <Text className="text-xl mb-2">{canteen?.name}</Text>
      </View>

      <MaterialTopTabs>
        <MaterialTopTabs.Screen
          name="reviews"
          options={{
            title: "Reviews",
          }}
        />
      </MaterialTopTabs>
    </>
  );
}
