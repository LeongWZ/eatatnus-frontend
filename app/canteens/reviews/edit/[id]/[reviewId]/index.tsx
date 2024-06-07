import fetchIndividualCanteen from "@/api/canteens/fetchIndividualCanteen";
import editStallReview from "@/api/canteens/editCanteenReview";
import ErrorView from "@/components/ErrorView";
import OutletReviewForm from "@/components/outlet/OutletReviewForm";
import AuthContext from "@/contexts/AuthContext";
import CanteenCollectionContext from "@/contexts/CanteenCollectionContext";
import { Redirect, useGlobalSearchParams, useRouter } from "expo-router";
import React, { useContext } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { FormData } from "@/components/outlet/OutletReviewForm";

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

    const outletReview = canteen.outletReviews.find(outletReview => outletReview.id === reviewId);

    if (!outletReview) {
        return <ErrorView />;
    }

    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    
    const submitOutletReviewForm = (formData: FormData) => {
        editStallReview(user, { ...formData, reviewId: reviewId })
            .then(async res => {
                setErrorMessage(null);

                dispatchCanteenCollectionAction({
                    type: "PATCH",
                    payload: {
                        item: await fetchIndividualCanteen(canteenId)
                    }
                });
            })
            .then(() => router.replace(`canteens/${canteenId}/reviews`))
            .catch(error => setErrorMessage(error.toString()));
    }
    
    return (
        <View>
            <View className="items-center">
                <Text className="text-3xl p-2">{canteen.name}</Text>
            </View>
            <OutletReviewForm outletReview={outletReview} submitOutletReviewForm={submitOutletReviewForm}/>

            {errorMessage && (
                <Text className="text-red-500 m-2">{errorMessage}</Text>
            )}
        </View>
    );
}