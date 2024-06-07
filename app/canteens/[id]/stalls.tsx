import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";
import React from "react";
import { View, FlatList } from "react-native";
import { useGlobalSearchParams } from "expo-router";
import ErrorView from "@/components/ErrorView";
import { Canteen } from "@/app/types";
import StallPreview from "@/components/stall/StallPreview";

export default function CanteenStalls() {
  const params = useGlobalSearchParams();
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
    <View className="p-4">
      <FlatList
        data={canteen.stalls}
        renderItem={({ item }) => (
          <View className="border">
            <StallPreview stall={item} />
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}
