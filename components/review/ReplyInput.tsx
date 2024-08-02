import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Keyboard } from "react-native";

type ReplyInputProps = {
  submitReply: (body: string) => void;
  autoFocus?: boolean;
};

export default function ReplyInput(props: ReplyInputProps) {
  const { submitReply, autoFocus } = props;

  const [reply, setReply] = React.useState<string>("");

  return (
    <View className="flex-row items-center space-x-2 p-1">
      <TextInput
        className="grow border p-2"
        placeholder="Reply..."
        value={reply}
        onChangeText={setReply}
        onSubmitEditing={() => {
          submitReply(reply);
          setReply("");
          Keyboard.dismiss();
        }}
        autoFocus={autoFocus ?? false}
      />
      <TouchableOpacity
        onPress={() => {
          submitReply(reply);
          setReply("");
          Keyboard.dismiss();
        }}
        disabled={reply.length === 0}
      >
        <Ionicons
          name="send"
          size={24}
          color={reply.length === 0 ? "gray" : "blue"}
        />
      </TouchableOpacity>
    </View>
  );
}
