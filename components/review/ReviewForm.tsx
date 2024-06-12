import { Review } from "@/app/types";
import React, { useCallback } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { Rating } from '@kolking/react-native-rating';

export type FormData = {
    rating: number;
    description: string | null;
}

type ReviewFormProps = {
    review?: Review;
    submitReviewForm: (data: FormData) => void;
}

export default function ReviewForm(props: ReviewFormProps) {
    const { review, submitReviewForm } = props;

    const [formData, setFormData] = React.useState<FormData>({
        rating: review?.rating ?? 3,
        description: review?.description ?? null
    })
    
    return (
        <View>
            <View className="items-center border m-2">
                <Text className="text-2xl">Rating</Text>
                <Rating
                    rating={formData.rating}
                    size={30}
                    onChange={(value: number) => setFormData({ ...formData, rating: value })}
                    style={{padding: 10}}
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
                <Button title="Submit" onPress={() => submitReviewForm(formData)}/>
            </View>
        </View>
    );
}