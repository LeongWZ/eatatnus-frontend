import deleteAllNotifications from "@/services/users/deleteAllNotifications";
import { Notification } from "../types";
import NotificationCard from "@/components/users/NotificationCard";
import { RootState } from "@/store";
import { SectionList, View, Text, TouchableOpacity, Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import fetchUserPersonalData from "@/services/users/fetchUserPersonalData";
import markNotificationAsRead from "@/services/users/markNotificationAsRead";
import {
  errorAuthAction,
  loadAuthAction,
  putUserDataAction,
} from "@/store/reducers/auth";
import { useNavigation, useRouter } from "expo-router";
import React from "react";

export default function NotificationPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const auth = useSelector((state: RootState) => state.auth);
  const user = auth.user;

  const onRefresh = () => {
    dispatch(loadAuthAction());
    fetchUserPersonalData()
      .then((user) => dispatch(putUserDataAction({ user })))
      .catch((error) => {
        dispatch(errorAuthAction({ errorMessage: error.message }));
        Alert.alert("Error fetching user data", error.message);
      });
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationCard
      notification={item}
      onPress={() =>
        markNotificationAsRead(item.id)
          .then(() => {
            if (user) {
              dispatch(
                putUserDataAction({
                  user: {
                    ...user,
                    notifications: user?.notifications?.map((x) =>
                      x.id === item.id ? { ...x, read: true } : x,
                    ),
                  },
                }),
              );
            }
            if ((item.review?.canteenId ?? null) !== null) {
              router.push(
                `/canteens/${item.review?.canteenId}/reviews/${item.review?.id}`,
              );
            } else if ((item.review?.stallId ?? null) !== null) {
              router.push(
                `/stalls/${item.review?.stallId}/reviews/${item.review?.id}`,
              );
            }
          })
          .catch((error) =>
            Alert.alert("Error updating notification", error.message),
          )
      }
    />
  );

  const renderSectionHeader = ({
    section: { title },
  }: {
    section: { title: string };
  }) => <Text className="mt-2 text-2xl">{title}</Text>;

  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.setOptions({
      title: "Notifications",
    });
  }, [navigation]);

  return (
    <View className="p-4 flex-1">
      <SectionList
        onRefresh={onRefresh}
        refreshing={auth.loading}
        contentContainerStyle={{ paddingBottom: 100 }}
        sections={[
          {
            title: "Unread",
            data: user?.notifications?.filter((x) => !x.read) ?? [],
          },
          {
            title: "Read",
            data: user?.notifications?.filter((x) => x.read) ?? [],
          },
        ]}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={({ section }) =>
          section.data.length === 0 ? (
            <Text className="mt-1 mb-4 text-base">None</Text>
          ) : null
        }
      />
      <View className="items-center p-2 border-t">
        <TouchableOpacity
          className="p-2 border-2 border-red-400 rounded-lg"
          onPress={() =>
            deleteAllNotifications()
              .then(onRefresh)
              .catch((error) =>
                Alert.alert("Error deleting notifications", error.message),
              )
          }
        >
          <Text className="text-red-800 text-lg">Delete All</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
