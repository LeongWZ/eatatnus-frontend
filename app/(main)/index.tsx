import { Link } from "expo-router";
import { Text, View, Pressable } from "react-native";
import { User } from "firebase/auth";
import React, { useContext } from "react";
import { Canteen } from "../types";
import CanteenPreview from "@/components/CanteenPreview";
import fetchCanteens from "@/api/canteens/fetchCanteens";
import AuthContext from "@/contexts/AuthContext";

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
  const [canteens, setCanteens] = React.useState<Canteen[]>([]);

  React.useEffect(
    () => {
      fetchCanteens()
      .then(result => setCanteens(result.data.items))
        .catch(error => {
          console.log(error);
          setCanteens([]);
        })
    },
    []
  );

  return (
    <View>
      <Header />
      {canteens.map(canteen => <CanteenPreview key={canteen.id} canteen={canteen}/>)}
    </View>
  );
}
