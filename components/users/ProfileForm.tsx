import { Profile } from "@/app/types";
import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Pressable,
  Image,
  ImageBackground,
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

  return (
    <View>
      <View className="m-2">
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

      <View className="items-center m-2">
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
        <Pressable
          onPress={pickImage}
          className="items-center border rounded-lg py-2 px-10 m-2 active:bg-slate-400"
        >
          <Text className="text-xl">Add profile image</Text>
        </Pressable>
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
          <Pressable className="active:bg-slate-600" onPress={onDelete}>
            <Ionicons
              name="close-circle-outline"
              style={{ color: "red" }}
              size={32}
            />
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}
