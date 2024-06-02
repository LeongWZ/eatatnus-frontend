import fetchIndividualCanteen from "@/api/canteens/fetchIndividualCanteen";
import { Canteen } from "@/app/types";
import ErrorView from "@/components/ErrorView";
import OutletReviewCard from "@/components/OutletReviewCard";
import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";
import roundToNthDecimalPlace from "@/utils/roundToNthDecimalPlace";
import { Link, useGlobalSearchParams } from "expo-router";
import React from "react";
import { View, Text, Pressable, FlatList, RefreshControl } from "react-native";

export default function ReviewsScreen() {
    const params = useGlobalSearchParams();
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
            <View className="flex-row justify-between border-b m-2">
                <View>
                    <Text>{reviewCount} reviews</Text>
                    {reviewCount > 0 && (
                        <>
                        <Text>Average rating: {averageRating}/5</Text>
                        <Text>Average seat availability: {averageSeatAvailability}/5</Text>
                        <Text>Average cleanliness: {averageCleanliness}/5</Text>
                        </>
                    )}
                </View>
                
                <View className="flex-col justify-center">
                    <Link href={`canteens/addreview/${canteen.id}`} className="bg-blue-500" asChild>
                        <Pressable className="p-2">
                            <Text className="text-xl">+ Review</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>
            <FlatList
                data={canteen.outletReviews.sort((a, b) => a.id < b.id ? 1 : -1)}
                renderItem={({item}) => <OutletReviewCard outletReview={item}/>}
                keyExtractor={item => item.id.toString()}
                extraData={canteen}
                contentContainerStyle={{ padding: 12, paddingBottom: 200, }}
                />
        </View>
    );
}