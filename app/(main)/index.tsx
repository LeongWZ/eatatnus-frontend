import { Link } from "expo-router";
import { Text, View, Pressable, FlatList } from "react-native";
import { User } from "firebase/auth";
import React, { useContext } from "react";
import { Canteen } from "../types";
import CanteenPreview from "@/components/CanteenPreview";
import AuthContext from "@/contexts/AuthContext";
import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";
import StallCollectionContext from "@/contexts/StallCollectionContext";
import StallPreview from "@/components/StallPreview";

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
  const { canteenCollection, dispatchCanteenCollectionAction } = React.useContext(CanteenCollectionContext);
  const canteens = canteenCollection.items;

  const { stallCollection, dispatchStallCollectionAction } = React.useContext(StallCollectionContext);
  const stalls = stallCollection.items;

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
