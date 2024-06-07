import fetchIndividualStall from "@/api/stalls/fetchIndividualStall";
import editStallReview from "@/api/stalls/editStallReview";
import ErrorView from "@/components/ErrorView";
import StallReviewForm, { FormData } from "@/components/stall/StallReviewForm";
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

    const stallReview = stall.stallReviews.find(stallReview => stallReview.id === reviewId);

    if (!stallReview) {
        return <ErrorView />;
    }

    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    
    const submitStallReviewForm = (formData: FormData) => {
        editStallReview(user, { ...formData, reviewId: reviewId })
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

            <StallReviewForm
                stallReview={stallReview}
                submitStallReviewForm={submitStallReviewForm}
                />

            {errorMessage && (
                <Text className="text-red-500 m-2">{errorMessage}</Text>
            )}
        </View>
    );
}