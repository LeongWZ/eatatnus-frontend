import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";
import React from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { Link, useLocalSearchParams } from "expo-router";
import ErrorView from "@/components/ErrorView";
import { Canteen } from "@/app/types";
import OutletReviewCard from "@/components/OutletReviewCard";
import roundToNthDecimalPlace from "@/utils/roundToNthDecimalPlace";
import StallPreview from "@/components/StallPreview";
import { MaterialTopTabs } from "@/components/MaterialTopTabs";

export default function CanteenPage() {
  const params = useLocalSearchParams();
  const id = parseInt(params.id as string);

  const { canteenCollection, dispatchCanteenCollectionAction } =
    React.useContext(CanteenCollectionContext);

  const canteen: Canteen | undefined = canteenCollection.items.find(
    (canteen) => canteen.id === id
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
