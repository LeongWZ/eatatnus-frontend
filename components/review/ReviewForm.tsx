import { Review } from "@/app/types";
import React from "react";
import { View, Text, TextInput, Button, Pressable, FlatList } from "react-native";
import { Rating } from '@kolking/react-native-rating';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';


export type FormData = {
    rating: number;
    description: string | null;
    imageUris: string[]
}

type ReviewFormProps = {
    review?: Review;
    submitReviewForm: (data: FormData) => void;
}

export default function ReviewForm(props: ReviewFormProps) {
    const { review, submitReviewForm } = props;

    const [formData, setFormData] = React.useState<FormData>({
        rating: review?.rating ?? 3,
        description: review?.description ?? null,
        imageUris: review?.images.map(image => image.url) ?? []
    })

    const pickImage = () => {
        ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        })
            .then(result => result.assets ?? [])
            .then(assets => setFormData(
                {
                    ...formData,
                    imageUris: assets.map(asset => asset.uri).concat(formData.imageUris)
                }
            ));
    }
    
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

            <FlatList
                data={formData.imageUris}
                renderItem={({ item }) => <Image source={{ uri: item }} style={{width:100,height:100}} placeholder="Image not found" />}
                keyExtractor={item => item}
                extraData={formData}
                horizontal
                showsHorizontalScrollIndicator={true}
                style={{marginVertical: 8, marginLeft: 8}}
                />

            <View className="items-center m-2">
                <Pressable onPress={pickImage} className="items-center border rounded-lg py-2 px-10 active:bg-slate-400">
                    <Text className="text-xl">Add images</Text>
                </Pressable>
            </View>

            <View className="items-end m-2">
                <Button title="Submit" onPress={async () => submitReviewForm(formData)}/>
            </View>
        </View>
    );
}