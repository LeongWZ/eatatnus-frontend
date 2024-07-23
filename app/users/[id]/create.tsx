import ErrorView from "@/components/ErrorView";
import { RootState } from "@/store";
import { useGlobalSearchParams, useNavigation, useRouter } from "expo-router";
import React from "react";
import { View, Text } from "react-native";
import { useSelector } from "react-redux";
import { Role, User } from "@/app/types";
import fetchUser from "@/api/users/fetchUser";
import ProfileForm from "@/components/users/ProfileForm";
import createUserProfile from "@/api/users/createUserProfile";

export default function CreateUserProfile() {
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
      title: "Create user profile",
    });
  }, [navigation]);

  if (
    (user?.profile && !loading) ||
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
        submitProfileForm={(data) =>
          createUserProfile(id, data)
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
