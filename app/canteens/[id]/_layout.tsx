import { Canteen } from "@/app/types";
import ErrorView from "@/components/ErrorView";
import { MaterialTopTabs } from "@/components/tabs/MaterialTopTabs";
import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text } from "react-native";

export default function CanteensLayout() {
  const params = useLocalSearchParams();
  const id = parseInt(params.id as string);

  const { canteenCollection, dispatchCanteenCollectionAction } =
    React.useContext(CanteenCollectionContext);

  const canteen: Canteen | undefined = canteenCollection.items.find(
    canteen => canteen.id === id
  );

  if (canteen === undefined) {
    return <ErrorView />;
  }

  return (
    <>
      <View className="p-3">
        <Text className="text-4xl">{canteen.name}</Text>
        <Text className="text-xl mb-2">{canteen.location.address}</Text>
      </View>

      <MaterialTopTabs>
        <MaterialTopTabs.Screen
          name="stalls"
          options={{
            title: "Stalls"
          }}
        />
        <MaterialTopTabs.Screen
          name="reviews"
          options={{
            title: "Reviews"
          }}
        />
      </MaterialTopTabs>
    </>
  );
}
