import { User } from "@/app/types";
import { TouchableOpacity, Image, Text } from "react-native";

type UserPressableProps = {
  user: User;
  onPress?: () => void;
};

export default function UserPressable(props: UserPressableProps) {
  const { user, onPress } = props;

  return (
    <TouchableOpacity
      className="flex-row items-center space-x-2"
      onPressOut={onPress}
    >
      <Image
        source={
          user?.profile?.image
            ? { uri: user?.profile.image.url }
            : require("@/assets/images/person.png")
        }
        className="rounded-full"
        style={{ width: 40, height: 40 }}
      />
      <Text className="py-2">{user.name}</Text>
    </TouchableOpacity>
  );
}
