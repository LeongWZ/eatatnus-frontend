import { Role, User, Reply } from "@/app/types";
import { View, Text, TouchableOpacity } from "react-native";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import UserPressable from "../users/UserPressable";
import Entypo from "@expo/vector-icons/Entypo";

// @ts-expect-error: No declaration file for module
// eslint-disable-next-line import/no-unresolved
import { HoldItem } from "react-native-hold-menu";
import React from "react";

type ReplyProps = {
  reply: Reply;
  user: User | null;
  parentReply?: Reply;
  onDelete: () => void;
  onReply: () => void;
};

export default function ReplyCard(props: ReplyProps) {
  const { reply, user, parentReply, onDelete, onReply } = props;

  const router = useRouter();

  const localeString: string = new Date(reply.createdAt).toLocaleString();

  const copyToClipboard = () => {
    Clipboard.setStringAsync(`${reply.body}`);
  };

  const MenuItems = [
    { text: "Copy", icon: "copy", onPress: copyToClipboard },
    ...(user?.id === reply.userId || user?.role === Role.Admin
      ? [
          {
            text: "Delete",
            icon: "trash",
            isDestructive: true,
            onPress: onDelete,
          },
        ]
      : []),
  ];

  return (
    <HoldItem items={MenuItems}>
      <View className="border p-2 mt-2 bg-white">
        <View className="flex-row items-center">
          {reply.user !== null ? (
            <UserPressable
              user={reply.user}
              onPress={() => router.push(`/users/${reply.user?.id}`)}
            />
          ) : (
            <Text>Deleted user</Text>
          )}
          {reply.parentId !== null && (
            <>
              <Entypo
                name="forward"
                size={24}
                color="black"
                style={{ marginHorizontal: 4 }}
              />
              <Text className="text-center bg-red">
                {`${parentReply?.user?.name ?? "Deleted User"}`}
              </Text>
            </>
          )}
        </View>
        <Text className="my-2">{localeString}</Text>
        <Text className="my-2">{reply.body}</Text>
        <View className="items-start">
          <TouchableOpacity onPress={onReply}>
            <Text className="text-lg text-blue-800">Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </HoldItem>
  );
}
