import { RootState } from "@/store";
import { Link } from "expo-router";
import { View, Text, Pressable, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

export default function SettingsPage() {
  const auth = useSelector((state: RootState) => state.auth);

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
      <View className="m-2 space-y-2">
        {auth.isAuthenticated ? (
          <>
            <Link href={`/users/${auth.user?.id}`} asChild>
              <TouchableOpacity className="items-center border rounded-lg py-2 px-10 active:bg-slate-400">
                <Text className="text-xl">View Profile</Text>
              </TouchableOpacity>
            </Link>
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
