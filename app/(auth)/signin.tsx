import { Link, Redirect, useRouter } from "expo-router";
import { Text, View, TextInput, Button } from "react-native";
import React, { useContext } from "react";
import signInWithEmail from "@/api/auth/signInWithEmail";
import AuthContext from "@/contexts/AuthContext";

type FormData = {
  email: string;
  password: string;
};

export default function SignIn() {
  const { auth, dispatchAuth } = useContext(AuthContext);

  const router = useRouter();

  const [formData, setFormData] = React.useState<FormData>({
    email: "",
    password: "",
  });

  const onSubmit = () => {
    dispatchAuth({ type: "SIGN_IN" });

    signInWithEmail(formData.email, formData.password)
      .then((result) => router.back())
      .catch((error) =>
        dispatchAuth({
          type: "ERROR",
          payload: { error_message: error.message },
        }),
      );
  };

  if (auth.status === "AUTHENTICATED") {
    return <Redirect href="/" />;
  }

  return (
    <View className="flex-1 justify-center items-center">
      <View className="bg-slate-200 w-4/5 h-4/5 p-4 border rounded-lg">
        <Text className="text-2xl mb-2">Sign in</Text>

        <Text className="mt-2 mb-1">Email</Text>
        <TextInput
          className="border px-2 rounded"
          placeholder="email"
          onChangeText={(input) => setFormData({ ...formData, email: input })}
        />

        <Text className="mt-2 mb-1">Password</Text>
        <TextInput
          className="border px-2 rounded"
          placeholder="password"
          secureTextEntry={true}
          onChangeText={(input) =>
            setFormData({ ...formData, password: input })
          }
        />

        <View className="mt-4 w-1/4">
          <Button
            title="Submit"
            onPress={onSubmit}
            disabled={formData.email === "" || formData.password === ""}
          />
        </View>

        <Link
          href="/resetpassword"
          className="mt-2 font-medium text-blue-600 dark:text-blue-500 underline"
        >
          Forget your password? Reset
        </Link>

        <Link
          href="/register"
          className="mt-2 font-medium text-blue-600 dark:text-blue-500 underline"
        >
          Don't have an account? Register
        </Link>

        {auth.status === "LOADING" && <Text className="mt-2">Loading...</Text>}

        {auth.error_message && (
          <Text className="text-red-500 mt-2">{auth.error_message}</Text>
        )}
      </View>
    </View>
  );
}
