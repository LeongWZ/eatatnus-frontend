import { RootState } from "@/store";
import { Link } from "expo-router";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { getAuth } from "firebase/auth";
import { useSelector } from "react-redux";
import * as Clipboard from "expo-clipboard";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Role } from "../types";
import React from "react";

export default function SettingsPage() {
  const auth = useSelector((state: RootState) => state.auth);

  const caloricTracker = useSelector(
    (state: RootState) => state.caloricTracker,
  );

  const [firebaseToken, setFirebaseToken] = React.useState<string | null>(null);

  const copyToClipboard = () => {
    if (firebaseToken === null) {
      return;
    }
    Clipboard.setStringAsync(firebaseToken);
  };

  React.useEffect(() => {
    if (auth.user?.role !== Role.Admin) {
      setFirebaseToken(null);
      return;
    }
    getAuth().currentUser?.getIdToken().then(setFirebaseToken);
  }, [auth.user]);

  return (
    <View className="items-center">
      <Text className="text-6xl py-12">
        eat@<Text style={{ color: "orange" }}>NUS</Text>
      </Text>
      <Text className="py-2 text-xl">
        Welcome, {auth.user ? auth.user.name : "Guest"}
      </Text>
      {auth.user && (
        <Text className="text-sm mt-2 mb-4">{auth.user?.role} account</Text>
      )}
      {firebaseToken !== null && (
        <View className="flex-row items-center space-x-1 mt-0 mb-4">
          <Text>Firebase Token</Text>
          <TouchableOpacity onPress={copyToClipboard}>
            <AntDesign name="copy1" size={24} color="black" />
          </TouchableOpacity>
        </View>
      )}
      <View className="m-2 space-y-2">
        {auth.isAuthenticated ? (
          <>
            <Link href={`/users/${auth.user?.id}`} asChild>
              <TouchableOpacity className="items-center border rounded-lg py-2 px-10 active:bg-slate-400">
                <Text className="text-xl">View Profile</Text>
              </TouchableOpacity>
            </Link>
            {!caloricTracker.isUnassigned && (
              <Link href={`/(caloric-tracker)/delete-caloric-tracker`} asChild>
                <TouchableOpacity className="items-center border rounded-lg py-2 px-10 active:bg-slate-400">
                  <Text className="text-xl">Delete Caloric Tracker</Text>
                </TouchableOpacity>
              </Link>
            )}
            <Link href="/signout" asChild>
              <Pressable className="items-center border rounded-lg py-2 px-10 active:bg-slate-400">
                <Text className="text-xl">Sign Out</Text>
              </Pressable>
            </Link>
            <Link href="/resetpassword" asChild>
              <Pressable className="items-center border rounded-lg py-2 px-10 active:bg-slate-400">
                <Text className="text-xl">Reset Password</Text>
              </Pressable>
            </Link>
            <Link href="/deleteaccount" asChild>
              <Pressable className="items-center border rounded-lg py-2 px-10 active:bg-slate-400">
                <Text className="text-xl text-red-500">Delete Account</Text>
              </Pressable>
            </Link>
          </>
        ) : (
          <>
            <Link href="/signin" asChild>
              <Pressable className="items-center border rounded-lg py-2 px-10 active:bg-slate-400">
                <Text className="text-xl">Sign In</Text>
              </Pressable>
            </Link>
            <Link href="/register" asChild>
              <Pressable className="items-center border rounded-lg py-2 px-10 active:bg-slate-400">
                <Text className="text-xl">Register</Text>
              </Pressable>
            </Link>
          </>
        )}
      </View>
    </View>
  );
}
