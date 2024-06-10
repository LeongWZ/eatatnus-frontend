import { OutletReview } from "@/app/types";
import React, { useCallback } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { Rating } from '@kolking/react-native-rating';

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
                <Rating
                    rating={formData.rating}
                    onChange={(value: number) => setFormData({ ...formData, rating: value })}
                    style={{padding: 10}}
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
                    <Rating
                        rating={formData.cleanliness}
                        onChange={(value: number) => setFormData({ ...formData, cleanliness: value })}
                        style={{padding: 10}}
                        />
                </View>
                <View className="items-center border border-l-0 w-1/2">
                    <Text className="text-xl">Seat Availability</Text>
                    <Rating
                        rating={formData.seatAvailability}
                        onChange={(value: number) => setFormData({ ...formData, seatAvailability: value })}
                        style={{padding: 10}}
                        />
                </View>
            </View>

            <View className="flex items-end m-2">
                <Button title="Submit" onPress={() => submitOutletReviewForm(formData)}/>
            </View>
        </View>
    );
}