import fetchIndividualStall from "@/api/stalls/fetchIndividualStall";
import submitStallReview from "@/api/stalls/submitStallReview";
import ErrorView from "@/components/ErrorView";
import StallReviewForm, { FormData } from "@/components/stall/StallReviewForm";
import AuthContext from "@/contexts/AuthContext";
import StallCollectionContext from "@/contexts/StallCollectionContext";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useContext } from "react";
import { View, Text } from "react-native";

export default function StallAddReview() {
    const params = useLocalSearchParams();
    const stallId = parseInt(params.id as string);

    const router = useRouter();

    const { user } = useContext(AuthContext).auth;

    if (!user) {
        return <Redirect href="/signin" />;
    }

    const {stallCollection, dispatchStallCollectionAction} = useContext(StallCollectionContext);
    const stall = stallCollection.items.find(stall => stall.id === stallId);

    if (stall === undefined) {
        return <ErrorView />
    }

    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    
    const submitStallReviewForm = (formData: FormData) => {
        submitStallReview(user, { ...formData, stallId: stallId })
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

    if (!user) {
        return <Redirect href="/signin" />;
    }
    
    if (stall === undefined) {
        return <ErrorView />
    }
    
    return (
        <View>
            <Text className="text-3xl">Review stall</Text>
            <Text className="text-2xl">{stall.name}</Text>

            <StallReviewForm submitStallReviewForm={submitStallReviewForm}/>

            {errorMessage && (
                <Text className="text-red-500 m-2">{errorMessage}</Text>
            )}
        </View>
    );
}