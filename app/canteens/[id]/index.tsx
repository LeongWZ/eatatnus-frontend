import CanteensDataContext from "@/contexts/CanteensDataContext";
import React from "react";
import { View, Text } from "react-native";
import { useLocalSearchParams } from 'expo-router';
import ErrorView from "@/components/ErrorView";
import { Canteen } from "@/app/types";

export default function CanteenPage() {
    const params = useLocalSearchParams();
    const id = parseInt(params.id as string);

    const canteen: Canteen | undefined = React.useContext(CanteensDataContext).canteensData.data.get(id);
    
    if (canteen === undefined) {
        return <ErrorView />;
    }

    const reviewCount = canteen.outletReviews.length;

    const averageRating = canteen.outletReviews.map(outletReview => outletReview.review.rating)
        .reduce((acc, x) => acc + x, 0) / Math.max(reviewCount, 1);
    
    const averageSeatAvailability = canteen.outletReviews.map(outletReview => outletReview.seatAvailability)
        .reduce((acc, x) => acc + x, 0) / Math.max(reviewCount, 1);
    
    const averageCleanliness = canteen.outletReviews.map(outletReview => outletReview.cleanliness)
        .reduce((acc, x) => acc + x, 0) / Math.max(reviewCount, 1);

    return (
        <View>
            <View className="border-b mb-2">
                <Text className="text-4xl">{canteen.name}</Text>
                <Text className="text-xl mb-2">{canteen.location.address}</Text>
                <Text>{reviewCount} reviews</Text>
                {reviewCount > 0 && (
                    <>
                    <Text>Average rating: {averageRating}/5</Text>
                    <Text>Average seat availability: {averageSeatAvailability}/5</Text>
                    <Text>Average cleanliness: {averageCleanliness}/5</Text>
                    </>
                )}
            </View>

            <View className="py-4">
                <Text className="text-2xl">Stalls</Text>
                {canteen.stalls.map(stall => (
                    <View key={stall.id}>
                        <Text>{stall.name}</Text>
                    </View>
                ))}
            </View>

            <View>
                <Text className="text-2xl">Reviews</Text>
                {canteen.outletReviews.map(outletReview => (
                    <View key={outletReview.id} className="border m-3">
                        <Text>By {outletReview.review.user.name}</Text>
                        <Text>Rating: {outletReview.review.rating}</Text>
                        <Text>Seat availability: {outletReview.seatAvailability}</Text>
                        <Text>Cleanliness: {outletReview.cleanliness}</Text>
                        <Text>Description: { outletReview.review.description }</Text>
                    </View>
                ))}
            </View>
        </View>
    );
}