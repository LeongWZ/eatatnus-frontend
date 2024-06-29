import { Canteen } from "@/app/types";
import ErrorView from "@/components/ErrorView";
import { MaterialTopTabs } from "@/components/tabs/MaterialTopTabs";
import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, Linking, TouchableOpacity } from "react-native";
import MapScreen from "@/components/MapScreen";

export default function CanteensLayout() {
  const params = useLocalSearchParams();
  const id = parseInt(params.id as string);

  const { canteenCollection, dispatchCanteenCollectionAction } =
    React.useContext(CanteenCollectionContext);

  const canteen: Canteen | undefined = canteenCollection.items.find(
    (canteen) => canteen.id === id,
  );

  if (canteen === undefined) {
    return <ErrorView />;
  }

  const openAddressInMaps = () => {
    const address = encodeURIComponent(canteen.location.address);
    const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err),
    );
  };

  return (
    <>
      <View className="p-5">
        <Text className="text-4xl">{canteen.name}</Text>
        <TouchableOpacity onPress={openAddressInMaps}>
          <Text className="text-xl mb-2">{canteen.location.address}</Text>
        </TouchableOpacity>
      </View>

      <MaterialTopTabs>
        <MaterialTopTabs.Screen
          name="stalls"
          options={{
            title: "Stalls",
          }}
        />
        <MaterialTopTabs.Screen
          name="reviews"
          options={{
            title: "Reviews",
          }}
        />
        <MaterialTopTabs.Screen
          name="map"
          options={{
            title: "Map",
          }}
          //component={MapScreen}
          initialParams={{ canteen }}
        />
      </MaterialTopTabs>
    </>
  );
}
