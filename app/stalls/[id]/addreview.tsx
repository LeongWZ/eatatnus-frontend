import fetchIndividualStall from "@/api/stalls/fetchIndividualStall";
import submitStallReview from "@/api/stalls/submitStallReview";
import AuthContext from "@/contexts/AuthContext";
import StallCollectionContext from "@/contexts/StallCollectionContext";
import { Redirect, useGlobalSearchParams, useRouter } from "expo-router";
import React, { useContext } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { Rating, AirbnbRating } from 'react-native-ratings';

type FormData = {
    rating: number;
    description: string | null;
}

export default function StallAddReview() {
    const params = useGlobalSearchParams();
    const stallId = parseInt(params.id as string);

    const router = useRouter();

    const { user } = useContext(AuthContext).auth;

    if (!user) {
        return <Redirect href="/signin" />;
    }

    const {stallCollection, dispatchStallCollectionAction} = useContext(StallCollectionContext);
    const stalls = stallCollection.items;

    const [formData, setFormData] = React.useState<FormData>({
        rating: 3,
        description: null
    })

    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    
    const onSubmit = () => {
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
    
    return (
        <View className="flex-1">
            <Text className="text-3xl">Review stall</Text>
            <Text className="text-2xl">{stalls.find(stall => stall.id === stallId)?.name}</Text>

            <View className="items-center border m-2">
                <Text className="text-2xl">Rating</Text>
                <AirbnbRating
                    count={5}
                    defaultRating={3}
                    size={30}
                    onFinishRating={input => setFormData({ ...formData, rating: input })}
                    />
            </View>

            <View className="m-2">
                <Text>Description</Text>
                <TextInput
                    className="border p-2 rounded"
                    placeholder="description"
                    multiline={true}
                    textAlignVertical="top"
                    numberOfLines={4}
                    onChangeText={input => setFormData({ ...formData, description: input })}/>
            </View>

            <View className="flex items-end m-2">
                <Button title="Submit" onPress={onSubmit}/>
            </View>

            {errorMessage && (
                <Text className="text-red-500 m-2">{errorMessage}</Text>
            )}
        </View>
    );
}