import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";
import React from "react";
import { View, FlatList } from "react-native";
import { useGlobalSearchParams } from "expo-router";
import ErrorView from "@/components/ErrorView";
import { Canteen, Stall } from "@/app/types";
import StallPreview from "@/components/stall/StallPreview";
import StallCollectionContext from "@/contexts/StallCollectionContext";

export default function CanteenStalls() {
  const params = useGlobalSearchParams();
  const id = parseInt(params.id as string);

  const { canteenCollection, dispatchCanteenCollectionAction } =
    React.useContext(CanteenCollectionContext);

  const { stallCollection, dispatchStallCollectionAction } = React.useContext(StallCollectionContext);

  const canteen: Canteen | undefined = canteenCollection.items.find(
    canteen => canteen.id === id
  );

  if (canteen === undefined) {
    return <ErrorView />;
  }

  return (
    <View className="p-4">
      <FlatList
        data={canteen.stalls
          .flatMap(stall => {
            const item = stallCollection.items.find(item => item.id === stall.id);
            return item ? [item] : [];
          })
        }
        renderItem={({ item }) => <StallPreview stall={item} />}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}
