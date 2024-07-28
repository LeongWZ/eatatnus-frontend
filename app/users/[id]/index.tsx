import fetchUser from "@/services/users/fetchUser";
import { Canteen, Role, Stall, User } from "@/app/types";
import { RootState } from "@/store";
import { Link, useGlobalSearchParams, useNavigation } from "expo-router";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  RefreshControl,
} from "react-native";
import { useSelector } from "react-redux";

export default function UserPage() {
  const params = useGlobalSearchParams();
  const id: number = parseInt(params.id as string);

  const navigation = useNavigation();

  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const auth = useSelector((state: RootState) => state.auth);

  const canteenCollection = useSelector(
    (state: RootState) => state.canteenCollection,
  );
  const stallCollection = useSelector(
    (state: RootState) => state.stallCollection,
  );

  const canteensReviewed = [
    ...new Set(
      user?.reviews
        ?.filter((review) => review.canteenId !== null)
        .map((review) => review.canteenId),
    ),
  ].flatMap((canteenId) => {
    const canteen: Canteen | undefined = canteenCollection.items.find(
      (canteen) => canteen.id === canteenId,
    );
    return canteen ? [canteen] : [];
  });

  const stallsReviewed = [
    ...new Set(
      user?.reviews
        ?.filter((review) => review.stallId !== null)
        .map((review) => review.stallId),
    ),
  ].flatMap((stallId) => {
    const stall: Stall | undefined = stallCollection.items.find(
      (stall) => stall.id === stallId,
    );
    return stall ? [stall] : [];
  });

  const onRefresh = () => {
    setLoading(true);
    setErrorMessage(null);

    if (id === auth.user?.id) {
      setUser(auth.user);
      setLoading(false);
    } else {
      fetchUser(id)
        .then((user) => setUser(user))
        .catch((error) => setErrorMessage("Failed to fetch user: " + error))
        .then(() => setLoading(false));
    }
  };

  React.useEffect(onRefresh, [id, auth]);

  React.useEffect(() => {
    navigation.setOptions({
      title: "User profile",
    });
  }, [navigation]);

  if (errorMessage !== null) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>{errorMessage}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="p-4"
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      <View className="items-center">
        <Text className="text-4xl">{user?.name}</Text>
        {user?.profile?.image ? (
          <Link href={`/users/${id}/photos`} asChild>
            <TouchableOpacity>
              <Image
                source={{ uri: user?.profile.image.url }}
                className="rounded-full m-2"
                style={{ width: 100, height: 100 }}
              />
            </TouchableOpacity>
          </Link>
        ) : (
          <Image
            source={require("@/assets/images/person.png")}
            className="rounded-full m-2"
            style={{ width: 100, height: 100 }}
          />
        )}
        <Text className="text-xl">{user?.profile?.bio}</Text>
        {user?.profile &&
          (auth.user?.id === id || auth.user?.role === Role.Admin) && (
            <Link href={`/users/${user?.id}/edit`} asChild>
              <TouchableOpacity className="border rounded-lg p-2 my-2">
                <Text>Edit Profile</Text>
              </TouchableOpacity>
            </Link>
          )}
        {!user?.profile &&
          (auth.user?.id === id || auth.user?.role === Role.Admin) && (
            <Link href={`/users/${user?.id}/create`} asChild>
              <TouchableOpacity className="border rounded-lg p-2 my-2">
                <Text>Create Profile</Text>
              </TouchableOpacity>
            </Link>
          )}
      </View>
      <View className="mt-4">
        <Text className="text-2xl">Canteens reviewed</Text>
        {canteensReviewed.map((canteen) => {
          return (
            <Link
              key={canteen.id}
              href={`/canteens/${canteen.id}/reviews`}
              asChild
            >
              <TouchableOpacity className="border rounded-lg p-4 my-1">
                <Text className="text-lg">{canteen.name}</Text>
              </TouchableOpacity>
            </Link>
          );
        })}
      </View>
      <View className="mt-4 mb-32">
        <Text className="text-2xl">Stalls reviewed</Text>
        {stallsReviewed.map((stall) => {
          return (
            <Link key={stall.id} href={`/stalls/${stall.id}/reviews`} asChild>
              <TouchableOpacity className="border rounded-lg p-4 my-1">
                <Text className="text-xl">{stall.name}</Text>
              </TouchableOpacity>
            </Link>
          );
        })}
      </View>
    </ScrollView>
  );
}
