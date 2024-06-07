import { StallReview } from "@/app/types";
import React from "react";
import { View, Text, TextInput, Button } from "react-native";
import { AirbnbRating } from 'react-native-ratings';

export type FormData = {
    rating: number;
    description: string | null;
}

type StallReviewFormProps = {
    stallReview?: StallReview;
    submitStallReviewForm: (data: FormData) => void;
}

export default function StallReviewForm(props: StallReviewFormProps) {
    const { stallReview, submitStallReviewForm } = props;

    const [formData, setFormData] = React.useState<FormData>({
        rating: stallReview?.rating ?? 3,
        description: stallReview?.description ?? null
    })
    
    return (
        <View>
            <View className="items-center border m-2">
                <Text className="text-2xl">Rating</Text>
                <AirbnbRating
                    count={5}
                    defaultRating={formData.rating}
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
                    onChangeText={input => setFormData({ ...formData, description: input })}
                    defaultValue={formData.description ?? undefined}
                    />
            </View>

            <View className="flex items-end m-2">
                <Button title="Submit" onPress={() => submitStallReviewForm(formData)}/>
            </View>
        </View>
    );
}