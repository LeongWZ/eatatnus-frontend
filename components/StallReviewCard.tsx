import { StallReview } from "@/app/types"
import { View, Text } from "react-native";

type StallReviewProps = {
    stallReview: StallReview;
}

export default function StallReviewCard(props: StallReviewProps) {
    const { stallReview } = props;

    return (
        <View className="border mt-2">
            <Text>By {stallReview.user.name}</Text>
            <Text>Rating: {stallReview.rating}</Text>
            <Text>Description: { stallReview.description }</Text>
        </View>
    );
}