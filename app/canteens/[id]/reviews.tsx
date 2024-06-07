import deleteCanteenReview from "@/api/canteens/deleteCanteenReview";
import fetchIndividualCanteen from "@/api/canteens/fetchIndividualCanteen";
import { Canteen, OutletReview } from "@/app/types";
import ErrorView from "@/components/ErrorView";
import OutletReviewCard from "@/components/outlet/OutletReviewCard";
import AuthContext from "@/contexts/AuthContext";
import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";
import roundToNthDecimalPlace from "@/utils/roundToNthDecimalPlace";
import { Link, useGlobalSearchParams, useRouter } from "expo-router";
import React from "react";
import { View, Text, Pressable, FlatList, RefreshControl } from "react-native";

export default function CanteenReviews() {
    const params = useGlobalSearchParams();
    const id = parseInt(params.id as string);

    const router = useRouter();

    const { canteenCollection, dispatchCanteenCollectionAction } = React.useContext(CanteenCollectionContext);
    const { auth, dispatchAuth } = React.useContext(AuthContext);

    const canteen: Canteen | undefined = canteenCollection.items
        .find(canteen => canteen.id === id);
    
    if (canteen === undefined) {
        return <ErrorView />;
    }

    const onRefresh = () => {
        dispatchCanteenCollectionAction({
            type: "FETCH"
        });

        fetchIndividualCanteen(canteen.id)
            .then(canteen => dispatchCanteenCollectionAction({
                type: "PATCH",
                payload: { item: canteen }
            }))
            .catch(error => dispatchCanteenCollectionAction({
                type: "ERROR",
                payload: { error_message: error }
            }))
    }

    return (
        <View>
            <View className="flex-row justify-between border-b m-2">
                <View>
                    <Text>{canteen.outletReviews.length} reviews</Text>
                    {canteen.outletReviews.length > 0 && (
                        <>
                        <Text>Average rating: {getAverageRating(canteen.outletReviews)}/5</Text>
                        <Text>Average seat availability: {getAverageSeatAvailability(canteen.outletReviews)}/5</Text>
                        <Text>Average cleanliness: {getAverageClealiness(canteen.outletReviews)}/5</Text>
                        </>
                    )}
                </View>
                
                <View className="flex-col justify-center">
                    <Link href={`canteens/reviews/add/${canteen.id}`} className="bg-blue-500" asChild>
                        <Pressable className="p-2">
                            <Text className="text-xl">+ Review</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>
            <FlatList
                data={canteen.outletReviews.sort((a, b) => a.id < b.id ? 1 : -1)}
                renderItem={({item}) =>
                    <OutletReviewCard
                        outletReview={item}
                        user={auth.user}
                        onEdit={() => {auth.user && router.push(`canteens/reviews/edit/${canteen.id}/${item.id}`)}}
                        onDelete={() => {auth.user && deleteCanteenReview(auth.user, item.id).then(onRefresh)}}
                        />
                }
                keyExtractor={item => item.id.toString()}
                extraData={canteen}
                contentContainerStyle={{ padding: 12, paddingBottom: 200, }}
                onRefresh={onRefresh}
                refreshing={canteenCollection.loading}
                />
        </View>
    );
}

function getAverageRating(outletReviews: OutletReview[]) {
    return roundToNthDecimalPlace(
        outletReviews.map(outletReview => outletReview.rating)
            .reduce((acc, x) => acc + x, 0) / Math.max(outletReviews.length, 1),
        1
    );
}

function getAverageSeatAvailability(outletReviews: OutletReview[]) {
    return roundToNthDecimalPlace(
        outletReviews.map(outletReview => outletReview.seatAvailability)
            .reduce((acc, x) => acc + x, 0) / Math.max(outletReviews.length, 1),
        1
    );
}

function getAverageClealiness(outletReviews: OutletReview[]) {
    return roundToNthDecimalPlace(
        outletReviews.map(outletReview => outletReview.cleanliness)
            .reduce((acc, x) => acc + x, 0) / Math.max(outletReviews.length, 1),
        1,
    );
}