import StallCollectionContext from "@/contexts/StallCollectionContext";
import React from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { Link, useGlobalSearchParams, useRouter } from 'expo-router';
import ErrorView from "@/components/ErrorView";
import { Review, Stall } from "@/app/types";
import ReviewCard from "@/components/review/ReviewCard";
import roundToNthDecimalPlace from "@/utils/roundToNthDecimalPlace";
import AuthContext from "@/contexts/AuthContext";
import fetchIndividualStall from "@/api/stalls/fetchIndividualStall";
import deleteReview from "@/api/reviews/deleteReview";

export default function StallReviews() {
    const params = useGlobalSearchParams();
    const id = parseInt(params.id as string);

    const router = useRouter();

    const { stallCollection, dispatchStallCollectionAction } = React.useContext(StallCollectionContext);
    const { auth, dispatchAuth } = React.useContext(AuthContext);

    const stall: Stall | undefined = stallCollection.items
        .find(stall => stall.id === id);
    
    if (stall === undefined) {
        return <ErrorView />;
    }

    const reviewCount = stall.reviews.length;

    const averageRating = getAverageRating(stall.reviews);

    const onRefresh = () => {
        dispatchStallCollectionAction({ type: "FETCH" });

        fetchIndividualStall(stall.id)
            .then(stall => dispatchStallCollectionAction({
                type: "PATCH",
                payload: { item: stall }
            }))
            .catch(error => dispatchStallCollectionAction({
                type: "ERROR",
                payload: { error_message: error }
            }))
    }

    return (
        <>
            <View className="flex-row justify-between border-b p-2">
                <View>
                    <Text>{reviewCount} reviews</Text>
                    {reviewCount > 0 && (
                        <Text>Average rating: {averageRating}/5</Text>
                    )}
                </View>

                <View className="flex-col justify-center">
                    <Link href={`stalls/reviews/add/${stall.id}`} className="bg-blue-500" asChild>
                        <Pressable className="p-2">
                            <Text className="text-xl">+ Review</Text>
                        </Pressable>
                    </Link>
                </View>
            </View>

            <View className="mx-3">
                <Text className="text-2xl m-2">Reviews</Text>
                
                <FlatList
                    data={stall.reviews.sort((a, b) => a.id < b.id ? 1 : -1)}
                    renderItem={({item}) =>
                            <ReviewCard
                                review={item}
                                user={auth.user}
                                onEdit={() => {router.push(`stalls/reviews/edit/${stall.id}/${item.id}`)}}
                                onDelete={() => {auth.user && deleteReview(auth.user, item.id).then(onRefresh)}}
                                />}
                    keyExtractor={item => item.id.toString()}
                    extraData={stall}
                    contentContainerStyle={{ paddingBottom: 300 }}
                    onRefresh={onRefresh}
                    refreshing={stallCollection.loading}
                    />
            </View>
        </>
    );
}

function getAverageRating(stallReviews: Review[]) {
    return roundToNthDecimalPlace(
        stallReviews.map(stallReview => stallReview.rating)
            .reduce((acc, x) => acc + x, 0) / Math.max(stallReviews.length, 1),
        1
    );
}