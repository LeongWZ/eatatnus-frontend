import { Canteen } from "@/app/types";
import ErrorView from "@/components/ErrorView";
import { MaterialTopTabs } from "@/components/tabs/MaterialTopTabs";
import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";

export default function CanteensLayout() {
  const params = useLocalSearchParams();
  const id = parseInt(params.id as string);

  const { canteenCollection, dispatchCanteenCollectionAction } =
    React.useContext(CanteenCollectionContext);

  const canteen: Canteen | undefined = canteenCollection.items.find(
    (canteen) => canteen.id === id,
  );

  const navigation = useNavigation();

  React.useEffect(() => {
    if (canteen === undefined) {
      return;
    }

    navigation.setOptions({
      title: canteen.name,
    });
  }, [canteen, navigation]);

  if (canteen === undefined) {
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
