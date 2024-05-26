import { Link } from "expo-router";
import { Text, View, Pressable } from "react-native";
import getUser from "@/utils/getUser";
import { User, onAuthStateChanged } from "firebase/auth";
import React from "react";
import {auth} from "@/firebaseConfig";
import { Canteen } from "../types";
import CanteenPreview from "@/components/CanteenPreview";
import fetchCanteens from "@/api/canteens/fetchCanteens";

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
  const [user, setUser] = React.useState<User | null>(getUser());
  onAuthStateChanged(auth, setUser);

  const [canteens, setCanteens] = React.useState<Canteen[]>([]);

  // For debugging purposes
  //onAuthStateChanged(auth, user => {setUser(user); (async () => console.log(await user?.getIdToken()))()});

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
      <Header user={user}/>
      {canteens.map(canteen => <CanteenPreview key={canteen.id} canteen={canteen}/>)}
    </View>
  );
}
