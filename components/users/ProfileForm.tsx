import { Profile } from "@/app/types";
import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";

export type FormData = {
  bio: string | null;
  imageUri: string | null;
};

type ProfileFormProps = {
  profile?: Profile;
  submitProfileForm: (data: FormData) => void;
};

export default function ProfileForm(props: ProfileFormProps) {
  const { profile, submitProfileForm } = props;

  const [formData, setFormData] = React.useState<FormData>({
    bio: profile?.bio ?? null,
    imageUri: profile?.image?.url ?? null,
  });

  const pickImage = () => {
    ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })
      .then((result) => result.assets ?? [])
      .then((assets) =>
        setFormData({
          ...formData,
          imageUri: assets.at(0)?.uri ?? null,
        }),
      );
  };

  const addImage = () => {
    ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    })
      .then((result) => result.assets ?? [])
      .then((assets) =>
        setFormData({
          ...formData,
          imageUri: assets.at(0)?.uri ?? null,
        }),
      );
  };

  return (
    <View className="p-2">
      <View>
        <Text>Bio</Text>
        <TextInput
          className="border p-2 rounded"
          placeholder="bio"
          multiline={true}
          textAlignVertical="top"
          numberOfLines={4}
          onChangeText={(input) => setFormData({ ...formData, bio: input })}
          defaultValue={formData.bio ?? undefined}
        />
      </View>

      <View className="items-center mx-2 my-4">
        {formData.imageUri ? (
          <ImageView
            uri={formData.imageUri}
            onDelete={() =>
              setFormData({
                ...formData,
                imageUri: null,
              })
            }
          />
        ) : (
          <Image
            source={require("@/assets/images/person.png")}
            style={{ width: 200, height: 200 }}
          />
        )}
      </View>

      <View className="flex-row justify-center space-x-2">
        <TouchableOpacity
          onPress={addImage}
          className="flex-1 justify-center items-center border rounded-lg"
        >
          <Text className="text-xl">Add Image</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={pickImage}
          className="flex-1 justify-center items-center border rounded-lg"
        >
          <Text className="text-xl text-center">Pick images from album</Text>
        </TouchableOpacity>
      </View>

      <View className="items-end m-2">
        <Button title="Submit" onPress={() => submitProfileForm(formData)} />
      </View>
    </View>
  );
}

type ImageViewProps = {
  uri: string;
  onDelete: () => void;
};

function ImageView(props: ImageViewProps) {
  const { uri, onDelete } = props;

  return (
    <View>
      <ImageBackground
        source={{ uri: uri }}
        style={{ width: 200, height: 200 }}
      >
        <View className="items-end">
          <TouchableOpacity onPress={onDelete}>
            <Ionicons
              name="close-circle-outline"
              style={{ color: "red" }}
              size={32}
            />
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}
