import { Link } from "expo-router";
import { Text, View, Pressable, FlatList } from "react-native";
import { User } from "firebase/auth";
import React, { useContext } from "react";
import { Canteen } from "../types";
import CanteenPreview from "@/components/CanteenPreview";
import fetchCanteens from "@/api/canteens/fetchCanteens";
import AuthContext from "@/contexts/AuthContext";
import CanteensDataContext from "@/contexts/CanteensDataContext";

type HeaderProps = {
  user: User | null;
}

function Header() {
  const { user } = useContext(AuthContext).auth;

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
  const canteens = React.useContext(CanteensDataContext).canteensData.data;

  return (
    <View>
      <Header />
      <FlatList
        data={canteens}
        renderItem={({item}) => <CanteenPreview canteen={item}/>}
        keyExtractor={item => item.id.toString()}
        extraData={canteens}
        />
    </View>
  );
}
