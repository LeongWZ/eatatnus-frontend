import { Link, useRouter } from "expo-router";
import {
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import CanteenPreview from "@/components/canteen/CanteenPreview";
import fetchCanteens from "@/services/canteens/fetchCanteens";
import getAverageRating from "@/utils/getAverageRating";
import StallPreview from "@/components/stall/StallPreview";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  putCanteenCollectionAction,
  loadCanteenCollectionAction,
  errorCanteenCollectionAction,
} from "@/store/reducers/canteenCollection";
import UserPressable from "@/components/users/UserPressable";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";

function Header() {
  const router = useRouter();

  const auth = useSelector((state: RootState) => state.auth);
  const user = auth.user;

  const unreadNotificationCount: number =
    user?.notifications?.filter((notification) => !notification.read).length ??
    0;

  return (
    <View className="flex-row justify-between p-2 border-b border-neutral-300">
      {user === null ? (
        <Text className="py-2">Guest</Text>
      ) : (
        <UserPressable
          user={user}
          onPress={() => router.push(`/users/${user?.id}`)}
        />
      )}

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
        <Link href="/users/notifications" asChild>
          <TouchableOpacity className="flex-row items-center">
            {unreadNotificationCount > 0 && (
              <Text className="bg-red-500 text-sm text-white rounded-full px-2 py-1">
                {unreadNotificationCount}
              </Text>
            )}
            <Ionicons name="notifications" size={24} color="black" />
          </TouchableOpacity>
        </Link>
      )}
    </View>
  );
}

export default function Index() {
  const dispatch = useDispatch();

  const canteenCollection = useSelector(
    (state: RootState) => state.canteenCollection,
  );
  const canteens = canteenCollection.items;

  const stallCollection = useSelector(
    (state: RootState) => state.stallCollection,
  );

  const topRatedStalls = [...stallCollection.items]
    .sort((a, b) => getAverageRating(b.reviews) - getAverageRating(a.reviews))
    .slice(0, 3);

  const [userLocation, setUserLocation] = React.useState<
    Location.LocationObject | undefined
  >(undefined);

  const onRefresh = () => {
    dispatch(loadCanteenCollectionAction());

    fetchCanteens()
      .then((canteens) =>
        dispatch(putCanteenCollectionAction({ items: canteens })),
      )
      .catch((error: Error) =>
        dispatch(errorCanteenCollectionAction({ errorMessage: error.message })),
      );
  };

  React.useEffect(() => {
    Location.requestForegroundPermissionsAsync()
      .then(({ status }) => {
        if (status !== "granted") {
          return undefined;
        }
        return Location.getCurrentPositionAsync({});
      })
      .then((location) => setUserLocation(location))
      .catch((error) => setUserLocation(undefined));
  }, []);

  if (
    (canteenCollection.items.length === 0 && canteenCollection.loading) ||
    (stallCollection.items.length === 0 && stallCollection.loading)
  ) {
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
        <View className="p-2" id="stalls">
          <Text className="text-2xl">Top-rated stalls</Text>
          {topRatedStalls.map((stall) => (
            <StallPreview
              stall={stall}
              canteen={canteens.find(
                (canteen) => canteen.id === stall.canteenId,
              )}
              key={stall.id}
            />
          ))}
        </View>
        <View className="p-2 pb-28" id="canteens">
          <Text className="text-2xl">Canteens</Text>
          {canteens.map((canteen) => (
            <CanteenPreview
              canteen={canteen}
              userLocation={userLocation}
              key={canteen.id}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
