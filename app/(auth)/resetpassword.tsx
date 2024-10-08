import { Text, View, TextInput, Button } from "react-native";
import React from "react";
import resetPasswordWithEmail from "@/services/auth/resetPasswordWithEmail";
import { useNavigation } from "expo-router";
import { auth } from "@/firebaseConfig";

type FormData = {
  email: string;
};

type ResetStatus = {
  data: boolean;
  error_message: string | null;
};

export default function ResetPassword() {
  const firebaseUser = auth.currentUser;

  const [formData, setFormData] = React.useState<FormData>({ email: "" });

  const [resetStatus, setResetStatus] = React.useState<ResetStatus>({
    data: false,
    error_message: null,
  });

  const onSubmit = React.useCallback(() => {
    resetPasswordWithEmail(formData.email)
      .then(() => setResetStatus({ data: true, error_message: null }))
      .catch((error) =>
        setResetStatus({ data: false, error_message: error.message }),
      );
  }, [formData.email]);

  React.useEffect(() => {
    if (firebaseUser?.email) {
      setFormData({ email: firebaseUser.email });
    }
  }, [firebaseUser]);

  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.setOptions({
      title: "Reset password",
    });
  }, [navigation]);

  return (
    <View className="flex-1 justify-center items-center">
      <View className="bg-slate-200 w-4/5 h-fit p-4 border rounded-lg">
        <Text className="text-2xl mb-2">Reset password</Text>

        <Text className="mt-2 mb-1">Email</Text>
        <TextInput
          className="border px-2 rounded"
          placeholder="email"
          value={formData.email}
          onChangeText={(input) => setFormData({ ...formData, email: input })}
        />

        <View className="mt-4 w-1/4">
          <Button
            title="Submit"
            onPress={onSubmit}
            disabled={formData.email === ""}
          />
        </View>

        {resetStatus.data && (
          <Text className="mt-2">
            An email has been sent to you with instructions on how to reset your
            password.
          </Text>
        )}

        {resetStatus.error_message && (
          <Text className="text-red-500 mt-2">{resetStatus.error_message}</Text>
        )}
      </View>
    </View>
  );
}
