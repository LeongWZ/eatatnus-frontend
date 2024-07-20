import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useGlobalSearchParams } from "expo-router";
import ErrorView from "@/components/ErrorView";
import { Canteen, Stall } from "@/app/types";
import StallPreview from "@/components/stall/StallPreview";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function CanteenStalls() {
  const params = useGlobalSearchParams();
  const id = parseInt(params.id as string);

  const canteenCollection = useSelector(
    (state: RootState) => state.canteenCollection,
  );

  const stallCollection = useSelector(
    (state: RootState) => state.stallCollection,
  );

  const canteen: Canteen | undefined = canteenCollection.items.find(
    (canteen) => canteen.id === id,
  );

  const stalls: Stall[] =
    canteen?.stalls.flatMap((stall) => {
      const item = stallCollection.items.find((item) => item.id === stall.id);
      return item ? [item] : [];
    }) ?? [];

  const openAddressInMaps = () => {
    if (canteen === undefined) {
      return;
    }

    const address = encodeURIComponent(canteen.location.address);
    const url = `https://www.google.com/maps/search/?api=1&query=${address}`;
    Linking.openURL(url).catch((err) =>
      console.error("An error occurred", err),
    );
  };

  if (canteen === undefined) {
    return <ErrorView />;
  }

  return (
    <ScrollView className="p-4">
      <View>
        <Text className="text-4xl">{canteen.name}</Text>
        <TouchableOpacity onPress={openAddressInMaps}>
          <Text className="text-xl mb-2">{canteen.location.address}</Text>
        </TouchableOpacity>
      </View>

      <View className="py-4">
        <Text className="text-2xl">Stalls</Text>
        {stalls.map((stall) => (
          <StallPreview stall={stall} key={stall.id} />
        ))}
      </View>
    </ScrollView>
  );
}
