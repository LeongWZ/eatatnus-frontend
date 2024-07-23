import ErrorView from "@/components/ErrorView";
import { RootState } from "@/store";
import { useGlobalSearchParams, useNavigation, useRouter } from "expo-router";
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { Role, User } from "@/app/types";
import fetchUser from "@/api/users/fetchUser";
import ProfileForm from "@/components/users/ProfileForm";
import updateUserProfile from "@/api/users/updateUserProfile";

export default function EditUserProfile() {
  const params = useGlobalSearchParams();
  const id: number = parseInt(params.id as string);
  const router = useRouter();

  const auth = useSelector((state: RootState) => state.auth);

  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const onRefresh = () => {
    setLoading(true);
    setErrorMessage(null);

    fetchUser(id)
      .then((user) => setUser(user))
      .catch((error) => setErrorMessage("Failed to fetch user: " + error))
      .then(() => setLoading(false));
  };

  React.useEffect(onRefresh, [id]);

  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.setOptions({
      title: "Edit user profile",
    });
  }, [navigation]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
      </View>
    );
  }

  if (
    (!user?.profile && !loading) ||
    (!user && !loading) ||
    (auth.user?.id !== id && auth.user?.role !== Role.Admin)
  ) {
    return <ErrorView />;
  }

  return (
    <View>
      <View className="items-center">
        <Text className="text-3xl p-2">{user?.name}</Text>
      </View>
      <ProfileForm
        profile={user?.profile ?? undefined}
        submitProfileForm={(data) =>
          updateUserProfile(id, data)
            .then(() =>
              router.canGoBack() ? router.back() : router.push(`/users/${id}`),
            )
            .catch((error: Error) => setErrorMessage(error.message))
        }
      />

      {errorMessage && <Text className="text-red-500 m-2">{errorMessage}</Text>}
    </View>
  );
}
