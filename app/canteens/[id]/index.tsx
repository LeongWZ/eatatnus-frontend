import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";
import React from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { Link, useLocalSearchParams } from 'expo-router';
import ErrorView from "@/components/ErrorView";
import { Canteen } from "@/app/types";
import OutletReviewCard from "@/components/OutletReviewCard";
import roundToNthDecimalPlace from "@/utils/roundToNthDecimalPlace";
import StallPreview from "@/components/StallPreview";

export default function CanteenPage() {
    const params = useLocalSearchParams();
    const id = parseInt(params.id as string);

    const { canteenCollection, dispatchCanteenCollectionAction } = React.useContext(CanteenCollectionContext);

    const canteen: Canteen | undefined = canteenCollection.items
        .find(canteen => canteen.id === id);
    
    if (canteen === undefined) {
        return <ErrorView />;
    }

    const reviewCount = canteen.outletReviews.length;

    const averageRating = roundToNthDecimalPlace(
        canteen.outletReviews.map(outletReview => outletReview.rating)
            .reduce((acc, x) => acc + x, 0) / Math.max(reviewCount, 1),
        1
    );
    
    const averageSeatAvailability = roundToNthDecimalPlace(
        canteen.outletReviews.map(outletReview => outletReview.seatAvailability)
            .reduce((acc, x) => acc + x, 0) / Math.max(reviewCount, 1),
        1
    );
    
    const averageCleanliness = roundToNthDecimalPlace(
        canteen.outletReviews.map(outletReview => outletReview.cleanliness)
            .reduce((acc, x) => acc + x, 0) / Math.max(reviewCount, 1),
        1,
    );

    return (
        <View>
            <View className="border-b m-2">
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
            
            <View className="m-3">
                <Text className="text-2xl">Stalls</Text>
                <FlatList
                    data={canteen.stalls}
                    renderItem={({item}) => (
                        <View className="border">
                            <StallPreview stall={item}/>
                        </View>
                    )}
                    keyExtractor={item => item.id.toString()}
                    extraData={canteen}
                    />
            </View>

            <View className="mx-3">
                <View className="flex-row justify-between">
                    <Text className="text-2xl">Reviews</Text>
                    <Link href="./review" className="bg-blue-500" asChild>
                        <Pressable className="p-2">
                            <Text className="text-xl">+ Review</Text>
                        </Pressable>
                    </Link>
                </View>
                
                <FlatList
                    data={canteen.outletReviews.sort((a, b) => a.id < b.id ? 1 : -1)}
                    renderItem={({item}) => <OutletReviewCard outletReview={item}/>}
                    keyExtractor={item => item.id.toString()}
                    extraData={canteen}
                    contentContainerStyle={{ paddingBottom: 600 }}
                    />
            </View>
        </View>
    );
}