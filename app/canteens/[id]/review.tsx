import fetchIndividualCanteen from "@/api/canteens/fetchIndividualCanteen";
import submitCanteenReview from "@/api/canteens/submitCanteenReview";
import AuthContext from "@/contexts/AuthContext";
import CanteensDataContext from "@/contexts/CanteensDataContext";
import { Redirect, useGlobalSearchParams, useRouter } from "expo-router";
import React, { useContext } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { Rating, AirbnbRating } from 'react-native-ratings';

type FormData = {
    rating: number;
    cleanliness: number;
    seatAvailability: number;
    description: string | null;
}

export default function CanteenReviewPage() {
    const params = useGlobalSearchParams();
    const canteenId = parseInt(params.id as string);

    const router = useRouter();

    const { user } = useContext(AuthContext).auth;

    if (!user) {
        return <Redirect href="/signin" />;
    }

    const { canteensData, dispatchCanteensData } = useContext(CanteensDataContext);

    const [formData, setFormData] = React.useState<FormData>({
        rating: 3,
        cleanliness: 3,
        seatAvailability: 3,
        description: null
    })

    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
    
    const onSubmit = () => {
        submitCanteenReview(user, { ...formData, canteenId: canteenId })
            .then(async res => {
                setErrorMessage(null);

                dispatchCanteensData({
                    type: "PATCH",
                    payload: {
                        canteen: await fetchIndividualCanteen(canteenId)
                    }
                });
            })
            .then(() => router.back())
            .catch(error => setErrorMessage(error.toString()));
    }
    
    return (
        <View className="flex-1">
            <Text className="text-3xl">Review canteen</Text>
            <Text className="text-2xl">{canteensData.data.find(canteen => canteen.id === canteenId)?.name}</Text>

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

            <View className="flex-row justify-between m-2">
                <View className="items-center border w-1/2">
                    <Text className="text-xl">Cleanliness</Text>
                    <AirbnbRating
                        count={5}
                        defaultRating={3}
                        size={20}
                        onFinishRating={input => setFormData({ ...formData, cleanliness: input })}
                    />
                </View>
                <View className="items-center border border-l-0 w-1/2">
                    <Text className="text-xl">Seat Availability</Text>
                    <AirbnbRating
                        count={5}
                        defaultRating={3}
                        size={20}
                        onFinishRating={input => setFormData({ ...formData, seatAvailability: input })}
                        />
                </View>
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