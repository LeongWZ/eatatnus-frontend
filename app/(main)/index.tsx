import { Link } from "expo-router";
import {
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Button,
  ScrollView,
} from "react-native";
import React, { useContext } from "react";
import CanteenPreview from "@/components/canteen/CanteenPreview";
import AuthContext from "@/contexts/AuthContext";
import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";
import StallCollectionContext from "@/contexts/StallCollectionContext";
import fetchCanteens from "@/api/canteens/fetchCanteens";
import getAverageRating from "@/utils/getAverageRating";
import StallPreview from "@/components/stall/StallPreview";

function Header() {
  const { user } = useContext(AuthContext).auth;

  return (
    <View className="flex-row justify-between p-2 border-b">
      <Text className="py-2">
        Welcome, {user ? user.displayName || user.email : "Guest"}
      </Text>
      {user === null ? (
        <View className="flex-row gap-2">
          <Link href="/signin" className="bg-blue-500 p-2" asChild>
            <Pressable>
              <Text>Sign In</Text>
            </Pressable>
          </Link>
          <Link href="/register" className="bg-blue-500 p-2" asChild>
            <Pressable>
              <Text>Register</Text>
            </Pressable>
          </Link>
        </View>
      ) : (
        <Link href="/signout" className="bg-blue-500 p-2" asChild>
          <Pressable>
            <Text>Sign Out</Text>
          </Pressable>
        </Link>
      )}
    </View>
  );
}

export default function Index() {
  const { canteenCollection, dispatchCanteenCollectionAction } =
    React.useContext(CanteenCollectionContext);
  const canteens = canteenCollection.items;

  const { stallCollection, dispatchStallCollectionAction } = React.useContext(
    StallCollectionContext,
  );
  const topRatedStalls = stallCollection.items
    .sort((a, b) => getAverageRating(b.reviews) - getAverageRating(a.reviews))
    .slice(0, 5);

  const onRefresh = () => {
    dispatchCanteenCollectionAction({ type: "FETCH" });

    fetchCanteens()
      .then((canteens) =>
        dispatchCanteenCollectionAction({
          type: "PUT",
          payload: {
            items: canteens,
          },
        }),
      )
      .catch((error) =>
        dispatchCanteenCollectionAction({
          type: "ERROR",
          payload: { error_message: error },
        }),
      );
  };

  if (canteens.length === 0 && canteenCollection.loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-6xl p-6">
          eat@<Text style={{ color: "orange" }}>NUS</Text>
        </Text>
        <ActivityIndicator size="large" className="p-4" />
        <Button onPress={onRefresh} title="Refresh" />
      </View>
    );
  }

  return (
    <View>
      <Header />
      <ScrollView>
        <View className="p-2" id="canteens">
          <Text className="text-2xl">Canteens</Text>
          {canteens.map((canteen) => (
            <CanteenPreview canteen={canteen} key={canteen.id} />
          ))}
        </View>
        <View className="p-2 pb-28" id="stalls">
          <Text className="text-2xl">Top-rated stalls</Text>
          {topRatedStalls.map((stall) => (
            <StallPreview
              stall={stall}
              includeCanteenName={true}
              key={stall.id}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
