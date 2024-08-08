import { Notification } from "@/app/types";
import { TouchableOpacity, Text } from "react-native";

type NotificationCardProps = {
  notification: Notification;
  onPress?: () => void;
};

export default function NotificationCard(props: NotificationCardProps) {
  const { notification, onPress } = props;

  const localeString: string = new Date(
    notification.createdAt,
  ).toLocaleString();

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`border rounded-xl my-2 p-2 ${notification.read ? "bg-gray-200" : ""}`}
    >
      <Text className="text-base">{localeString}</Text>
      <Text className="text-lg">{notification.message}</Text>
    </TouchableOpacity>
  );
}
