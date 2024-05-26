import { Link, Redirect } from "expo-router";
import { Text, View, TextInput, Button, Pressable } from "react-native";
import getUser from "@/utils/getUser";
import React from "react";
import signOut from "@/api/auth/signOut";
import useAuthReducer, {
  AuthStatus,
  AuthStatusAction,
} from "@/hooks/useAuthReducer";

export default function SignOut() {

  const [authStatus, dispatchAuthStatus]: [
    AuthStatus,
    React.Dispatch<AuthStatusAction>
  ] = useAuthReducer({
    data: getUser() === null ? "NOT_AUTHENTICATED" : "AUTHENTICATED",
    error_message: null,
  });

  const onSignOut = () => {
    dispatchAuthStatus({ type: "SIGN_OUT", error_message: null });

    signOut()
      .then(() =>
        dispatchAuthStatus({ type: "SIGN_OUT_SUCCESS", error_message: null })
      )
      .catch((error) =>
        dispatchAuthStatus({ type: "ERROR", error_message: error.message })
      );
  };

  if (authStatus.data === "NOT_AUTHENTICATED") {
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

        {authStatus.data === "LOADING" && (
          <Text className="mt-2">Signing out now...</Text>
        )}

        {authStatus.error_message && (
          <Text className="text-red-500 mt-2">{authStatus.error_message}</Text>
        )}
      </View>
    </View>
  );
}
