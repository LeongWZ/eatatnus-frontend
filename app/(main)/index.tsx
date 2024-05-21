import { Link } from "expo-router";
import { Text, View, Pressable } from "react-native";
import useUser from "@/hooks/useUser";
import { User, onAuthStateChanged } from "firebase/auth";
import React from "react";
import {auth} from "@/firebaseConfig";

type HeaderProps = {
  user: User | null;
}

function Header({user}: HeaderProps) {
  return (
    <View className="flex-row justify-between p-2 border-b">
      <Text className="py-2">
        Welcome {user ? (user.displayName || user.email) : "guest"}
      </Text>
      {user === null
        ? (
          <View className="flex-row gap-2">
            <Link href="/signin" className="bg-blue-500 p-2" asChild>
              <Pressable>
                  <Text>Sign in</Text>
              </Pressable>
            </Link>
            <Link href="/register" className="bg-blue-500 p-2" asChild>
              <Pressable>
                  <Text>Register</Text>
              </Pressable>
            </Link>
          </View>
        )
        : (
          <Link href="/signout" className="bg-blue-500 p-2" asChild>
            <Pressable>
                <Text>Sign out</Text>
            </Pressable>
          </Link>
        )
      }
    </View>
  );
}

export default function Index() {
  const [user, setUser] = React.useState<User | null>(useUser());
  onAuthStateChanged(auth, setUser);

  return (
    <View>
      <Header user={user}/>
      <Text className="p-2">Welcome to the app!</Text>
    </View>
  );
}
