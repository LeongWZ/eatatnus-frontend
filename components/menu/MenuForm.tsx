import React from "react";
import { View, TextInput, Button } from "react-native";

type MenuFormProps = {
  onSubmit: (itemName: string) => void;
};

export default function MenuForm(props: MenuFormProps) {
  const { onSubmit } = props;

  const [itemName, setItemName] = React.useState<string>("");

  return (
    <View className="flex-row justify-between p-2">
      <TextInput
        placeholder="Add new menu item"
        value={itemName}
        onChangeText={(input) => setItemName(input)}
      />
      <Button title="Add" onPress={() => onSubmit(itemName)} />
    </View>
  );
}
