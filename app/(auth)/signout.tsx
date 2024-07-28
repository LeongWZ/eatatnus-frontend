import { Link, Redirect, useNavigation, useRouter } from "expo-router";
import { Text, View, Button, Pressable } from "react-native";
import React from "react";
import signOut from "@/services/auth/signOut";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { errorAuthAction, loadAuthAction } from "@/store/reducers/auth";

export default function SignOut() {
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const dispatch = useDispatch();

  const onSignOut = () => {
    dispatch(loadAuthAction());

    signOut()
      .then(() => (router.canGoBack() ? router.back() : router.push("/")))
      .catch((err) =>
        dispatch(
          errorAuthAction({
            errorMessage: "Failed to sign out: " + err.message,
          }),
        ),
      );
  };

  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.setOptions({
      title: "Sign out",
    });
  }, [navigation]);

  if (!auth.isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <View className="flex-1 justify-center items-center">
      <View className="bg-slate-200 w-4/5 h-fit p-4 border rounded-lg">
        <Text className="text-2xl mb-2">Sign out</Text>

        <Text className="mt-4">
          Are you sure that you would like to sign out?
        </Text>

        <View className="flex-row justify-center gap-x-4 mt-5">
          <View className="grow rounded">
            <Button title="Sign out" onPress={onSignOut} />
          </View>

          <Link href="/" className="grow bg-gray-500 p-2 items-center" asChild>
            <Pressable>
              <Text className="text-white uppercase">Cancel</Text>
            </Pressable>
          </Link>
        </View>

        {auth.loading && <Text className="mt-2">Signing out now...</Text>}

        {auth.errorMessage && (
          <Text className="text-red-500 mt-2">{auth.errorMessage}</Text>
        )}
      </View>
    </View>
  );
}
