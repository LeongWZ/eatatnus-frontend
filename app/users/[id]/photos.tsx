import fetchUser from "@/services/users/fetchUser";
import { User } from "@/app/types";
import Gallery from "@/components/image/gallery";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

export default function UserPhotos() {
  const params = useLocalSearchParams();

  const id = parseInt(params.id as string);
  const router = useRouter();
  const setParams = router.setParams;
  const goBack = router.back;

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
      title: "User photo",
    });
  }, [navigation]);

  if (!user?.profile?.image || errorMessage !== null) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>{errorMessage || "Image not found"}</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator />
        <Text>Loading image...</Text>
      </View>
    );
  }

  return (
    <Gallery
      images={[user.profile.image]}
      imageId={user?.profile.image.id}
      onSetParams={setParams}
      onGoBack={goBack}
    />
  );
}
