import StallCollectionContext from "@/contexts/StallCollectionContext";
import React from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { Link, useLocalSearchParams } from 'expo-router';
import ErrorView from "@/components/ErrorView";
import { Canteen, Stall } from "@/app/types";
import StallReviewCard from "@/components/StallReviewCard";
import roundToNthDecimalPlace from "@/utils/roundToNthDecimalPlace";
import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";

export default function StallPage() {
    const params = useLocalSearchParams();
    const id = parseInt(params.id as string);

    const { stallCollection, dispatchStallCollectionAction } = React.useContext(StallCollectionContext);
    const { canteenCollection, dispatchCanteenCollectionAction } = React.useContext(CanteenCollectionContext);

    const stall: Stall | undefined = stallCollection.items
        .find(stall => stall.id === id);
    
    if (stall === undefined) {
        return <ErrorView />;
    }

    const canteen: Canteen | undefined = canteenCollection.items.find(canteen => canteen.id === stall.canteenId)

    const reviewCount = stall.stallReviews.length;

    const averageRating = roundToNthDecimalPlace(
        stall.stallReviews.map(stallReview => stallReview.rating)
            .reduce((acc, x) => acc + x, 0) / Math.max(reviewCount, 1),
        1
    );

    return (
        <View>
            <View className="p-2">
                <Text className="text-4xl">{stall.name}</Text>
                <Text className="text-xl mb-2">{canteen?.name}</Text>
                <Text className="text-xl mb-2">{canteen?.location.address}</Text>
            </View>

            <View className="flex-row justify-between border-b p-2">
                <View>
                    <Text>{reviewCount} reviews</Text>
                    {reviewCount > 0 && (
                        <Text>Average rating: {averageRating}/5</Text>
                    )}
                </View>

                <View className="flex-col justify-center">
                    <Link href="./addreview" className="bg-blue-500" asChild>
                        <Pressable className="p-2">
                            <Text className="text-xl">+ Review</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>

            <View className="mx-3">
                <Text className="text-2xl m-2">Reviews</Text>
                
                <FlatList
                    data={stall.stallReviews.sort((a, b) => a.id < b.id ? 1 : -1)}
                    renderItem={({item}) => <StallReviewCard stallReview={item}/>}
                    keyExtractor={item => item.id.toString()}
                    extraData={stall}
                    contentContainerStyle={{ paddingBottom: 200 }}
                    />
            </View>
        </View>
    );
}