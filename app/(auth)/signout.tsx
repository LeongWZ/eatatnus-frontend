import { Link, Redirect } from "expo-router";
import { Text, View, Button, Pressable } from "react-native";
import React, { useContext } from "react";
import signOut from "@/api/auth/signOut";
import AuthContext from "@/contexts/AuthContext";

export default function SignOut() {
  const { auth, dispatchAuth } = useContext(AuthContext);

  const onSignOut = () => {
    dispatchAuth({ type: "SIGN_OUT" });

    signOut().catch((error) =>
      dispatchAuth({
        type: "ERROR",
        payload: { error_message: error.message },
      }),
    );
  };

  if (auth.status === "NOT_AUTHENTICATED") {
    return <Redirect href="/" />;
  }

  return (
    <View className="flex-1 justify-center items-center">
      <View className="bg-slate-200 w-4/5 p-4 border rounded-lg">
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

        {auth.status === "LOADING" && (
          <Text className="mt-2">Signing out now...</Text>
        )}

        {auth.error_message && (
          <Text className="text-red-500 mt-2">{auth.error_message}</Text>
        )}
      </View>
    </View>
  );
}
