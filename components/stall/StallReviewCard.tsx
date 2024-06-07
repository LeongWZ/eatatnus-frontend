import { StallReview } from "@/app/types"
import { User } from "firebase/auth";
import { View, Text } from "react-native";
import * as Clipboard from 'expo-clipboard';

// @ts-expect-error: No declaration file for module
import { HoldItem } from "react-native-hold-menu";


type StallReviewProps = {
    stallReview: StallReview;
    user: User | null;
    onEdit: () => void;
    onDelete: () => void;
}

export default function StallReviewCard(props: StallReviewProps) {
    const { stallReview, user, onEdit, onDelete } = props;

    const copyToClipboard = () => {
        Clipboard.setStringAsync(`${stallReview.user.name}: ${stallReview.description}`)
    }

    const MenuItems = [
        { text: "Copy", icon: "copy", onPress: copyToClipboard },
        ...(user?.displayName === stallReview.user.name
            ? [{ text: "Edit", icon: "edit", onPress: onEdit }]
            : []
        ),
        ...(user?.displayName === stallReview.user.name
            ? [{ text: "Delete", icon: "trash", isDestructive: true, onPress: onDelete }]
            : []
        ),
    ];

    return (
        <HoldItem items={MenuItems}>
            <View className="border mt-2 p-2 bg-white">
                <Text>By {stallReview.user.name}</Text>
                <Text>Rating: {stallReview.rating}</Text>
                <Text>Description: { stallReview.description }</Text>
            </View>
        </HoldItem>
    );
}