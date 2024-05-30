import { OutletReview } from "@/app/types"
import { View, Text } from "react-native";

type OutletReviewProps = {
    outletReview: OutletReview;
}

export default function OutletReviewCard(props: OutletReviewProps) {
    const { outletReview } = props;

    return (
        <View className="border mt-2">
            <Text>By {outletReview.user.name}</Text>
            <Text>Rating: {outletReview.rating}</Text>
            <Text>Seat availability: {outletReview.seatAvailability}</Text>
            <Text>Cleanliness: {outletReview.cleanliness}</Text>
            <Text>Description: { outletReview.description }</Text>
        </View>
    );
}