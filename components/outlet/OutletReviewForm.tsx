import { OutletReview } from "@/app/types";
import React from "react";
import { View, Text, TextInput, Button } from "react-native";
import { AirbnbRating } from 'react-native-ratings';

export type FormData = {
    rating: number;
    cleanliness: number;
    seatAvailability: number;
    description: string | null;
}

type OutletReviewFormProps = {
    outletReview?: OutletReview
    submitOutletReviewForm: (data: FormData) => void
}

export default function OutletReviewForm(props: OutletReviewFormProps) {
    const { outletReview, submitOutletReviewForm } = props;

    const [formData, setFormData] = React.useState<FormData>({
        rating: outletReview?.rating ?? 3,
        cleanliness: outletReview?.cleanliness ?? 3,
        seatAvailability: outletReview?.seatAvailability ?? 3,
        description: outletReview?.description ?? null
    })
    
    return (
        <View>
            <View className="items-center border m-2">
                <Text className="text-2xl">Rating</Text>
                <AirbnbRating
                    count={5}
                    defaultRating={formData.rating}
                    size={26}
                    onFinishRating={input => setFormData({ ...formData, rating: input })}
                    />
            </View>

            <TextInput
                className="border p-2 m-2 rounded"
                placeholder="Share details of your own experience"
                multiline={true}
                textAlignVertical="top"
                numberOfLines={5}
                onChangeText={input => setFormData({ ...formData, description: input })}
                defaultValue={formData.description ?? undefined}
                />

            <View className="flex-row justify-between m-2">
                <View className="items-center border w-1/2">
                    <Text className="text-xl">Cleanliness</Text>
                    <AirbnbRating
                        count={5}
                        defaultRating={formData.cleanliness}
                        size={20}
                        onFinishRating={input => setFormData({ ...formData, cleanliness: input })}
                    />
                </View>
                <View className="items-center border border-l-0 w-1/2">
                    <Text className="text-xl">Seat Availability</Text>
                    <AirbnbRating
                        count={5}
                        defaultRating={formData.seatAvailability}
                        size={20}
                        onFinishRating={input => setFormData({ ...formData, seatAvailability: input })}
                        />
                </View>
            </View>

            <View className="flex items-end m-2">
                <Button title="Submit" onPress={() => submitOutletReviewForm(formData)}/>
            </View>
        </View>
    );
}