import fetchIndividualCanteen from "@/api/canteens/fetchIndividualCanteen";
import editReview from "@/api/reviews/editReview";
import ErrorView from "@/components/ErrorView";
import ReviewForm, { FormData } from "@/components/review/ReviewForm";
import AuthContext from "@/contexts/AuthContext";
import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";
import { Redirect, useGlobalSearchParams, useRouter } from "expo-router";
import React, { useContext } from "react";
import { View, Text, TextInput, Button } from "react-native";

export default function CanteenEditReview() {
    const params = useGlobalSearchParams();
    const canteenId = parseInt(params.id as string);
    const reviewId = parseInt(params.reviewId as string);

    const router = useRouter();

    const { user } = useContext(AuthContext).auth;

    if (!user) {
        return <Redirect href="/signin" />;
    }

    const {canteenCollection, dispatchCanteenCollectionAction} = useContext(CanteenCollectionContext);
    const canteen = canteenCollection.items.find(canteen => canteen.id === canteenId)

    if (!canteen) {
        return <ErrorView />;
    }

    const review = canteen.reviews.find(review => review.id === reviewId);

    if (!review) {
        return <ErrorView />;
    }

    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    
    const submitReviewForm = (formData: FormData) => {
        editReview(user, reviewId, formData)
            .then(async res => {
                setErrorMessage(null);

                dispatchCanteenCollectionAction({
                    type: "PATCH",
                    payload: {
                        item: await fetchIndividualCanteen(canteenId)
                    }
                });
            })
            .then(() => router.back())
            .catch(error => {
                setErrorMessage(error.toString());
                console.error(error);
            });
    }
    
    return (
        <View>
            <View className="items-center">
                <Text className="text-3xl p-2">{canteen.name}</Text>
            </View>
            <ReviewForm review={review} submitReviewForm={submitReviewForm}/>

            {errorMessage && (
                <Text className="text-red-500 m-2">{errorMessage}</Text>
            )}
        </View>
    );
}