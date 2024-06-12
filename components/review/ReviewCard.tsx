import { Review } from "@/app/types"
import { User } from "firebase/auth";
import { View, Text } from "react-native";
import * as Clipboard from 'expo-clipboard';

// @ts-expect-error: No declaration file for module
import { HoldItem } from "react-native-hold-menu";


type ReviewProps = {
    review: Review;
    user: User | null;
    onEdit: () => void;
    onDelete: () => void;
}

export default function ReviewCard(props: ReviewProps) {
    const { review, user, onEdit, onDelete } = props;

    const copyToClipboard = () => {
        Clipboard.setStringAsync(`${review.user.name}: ${review.description}`)
    }

    const MenuItems = [
        { text: "Copy", icon: "copy", onPress: copyToClipboard },
        ...(user?.displayName === review.user.name
            ? [{ text: "Edit", icon: "edit", onPress: onEdit }]
            : []
        ),
        ...(user?.displayName === review.user.name
            ? [{ text: "Delete", icon: "trash", isDestructive: true, onPress: onDelete }]
            : []
        ),
    ];

    return (
        <HoldItem items={MenuItems}>
            <View className="border mt-2 p-2 bg-white">
                <Text>By {review.user.name}</Text>
                <Text>Rating: {review.rating}</Text>
                <Text>Description: { review.description }</Text>
            </View>
        </HoldItem>
    );
}