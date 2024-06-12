import fetchIndividualStall from "@/api/stalls/fetchIndividualStall";
import editReview from "@/api/reviews/editReview";
import ErrorView from "@/components/ErrorView";
import ReviewForm, { FormData } from "@/components/review/ReviewForm";
import AuthContext from "@/contexts/AuthContext";
import StallCollectionContext from "@/contexts/StallCollectionContext";
import { Redirect, useGlobalSearchParams, useRouter } from "expo-router";
import React, { useContext } from "react";
import { View, Text } from "react-native";

export default function StallEditReview() {
    const params = useGlobalSearchParams();
    const stallId = parseInt(params.id as string);
    const reviewId = parseInt(params.reviewId as string);

    const router = useRouter();

    const { user } = useContext(AuthContext).auth;

    if (!user) {
        return <Redirect href="/signin" />;
    }

    const {stallCollection, dispatchStallCollectionAction} = useContext(StallCollectionContext);
    const stall = stallCollection.items.find(stall => stall.id === stallId);

    if (!stall) {
        return <ErrorView />;
    }

    const review = stall.reviews.find(review => review.id === reviewId);

    if (!review) {
        return <ErrorView />;
    }

    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    
    const submitReviewForm = (formData: FormData) => {
        editReview(user, reviewId, formData)
            .then(async res => {
                setErrorMessage(null);
                
                dispatchStallCollectionAction({
                    type: "PATCH",
                    payload: {
                        item: await fetchIndividualStall(stallId)
                    }
                });
            })
            .then(() => router.back())
            .catch(error => setErrorMessage(error.toString()));
    }
    
    return (
        <View>
            <Text className="text-3xl">Review stall</Text>
            <Text className="text-2xl">{stall.name}</Text>

            <ReviewForm
                review={review}
                submitReviewForm={submitReviewForm}
                />

            {errorMessage && (
                <Text className="text-red-500 m-2">{errorMessage}</Text>
            )}
        </View>
    );
}