import { StallReview } from "@/app/types";
import React, { useCallback } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { Rating } from '@kolking/react-native-rating';

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
                <Button title="Submit" onPress={() => submitStallReviewForm(formData)}/>
            </View>
        </View>
    );
}