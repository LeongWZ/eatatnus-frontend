import { Food } from "@/app/types";
import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";

type AddFoodViewProps = {
  submitCreate: (food: Omit<Food, "id">) => void;
};

export default function EditFoodView(props: AddFoodViewProps) {
  const { submitCreate } = props;

  const [foodInput, setFoodInput] = React.useState<Omit<Food, "id">>({
    name: "",
  });

  const [showFoodInput, setShowFoodInput] = React.useState<boolean>(false);

  if (!showFoodInput) {
    return (
      <View className="items-center m-2">
        <Pressable
          className="items-center border rounded-lg py-2 px-10 active:bg-slate-400"
          onPress={() => setShowFoodInput(true)}
        >
          <Text className="text-lg">+ Menu item</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="border rounded my-2 p-4 space-y-4">
      <View>
        <Text className="text-lg">Food name:</Text>
        <TextInput
          className="border rounded p-2 text-xl"
          onChangeText={(text) => setFoodInput({ ...foodInput, name: text })}
          value={foodInput.name}
        />
      </View>
      <View className="flex-row space-x-4">
        <Pressable
          className="border-2 rounded border-red-400 active:bg-red-100 p-2"
          onPress={() => {
            setShowFoodInput(false);
          }}
        >
          <Text className="text-lg text-red-700">Cancel</Text>
        </Pressable>
        <Pressable
          className="border-2 rounded border-blue-400 active:bg-blue-100 p-2"
          onPress={() => submitCreate(foodInput)}
          disabled={foodInput.name === ""}
        >
          <Text className="text-lg text-blue-700">Save</Text>
        </Pressable>
      </View>
    </View>
  );
}
