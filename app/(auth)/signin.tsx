import { Link, Redirect, useNavigation, useRouter } from "expo-router";
import { Text, View, TextInput, Button } from "react-native";
import React from "react";
import signInWithEmail from "@/api/auth/signInWithEmail";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  errorAuthAction,
  loadAuthAction,
  putUserDataAction,
} from "@/store/reducers/auth";
import fetchUserPersonalData from "@/api/users/fetchUserPersonalData";

type FormData = {
  email: string;
  password: string;
};

export default function SignIn() {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const router = useRouter();

  const [formData, setFormData] = React.useState<FormData>({
    email: "",
    password: "",
  });

  const onSubmit = () => {
    dispatch(loadAuthAction());

    signInWithEmail(formData.email, formData.password)
      .then((result) =>
        fetchUserPersonalData()
          .then((userData) => dispatch(putUserDataAction({ user: userData })))
          .catch((error: Error) => {
            dispatch(
              errorAuthAction({
                errorMessage: error.message,
              }),
            );
          }),
      )
      .then(() => (router.canGoBack() ? router.back() : router.replace("/")))
      .catch((err) => {
        dispatch(
          errorAuthAction({
            errorMessage: "Failed to sign in:\n" + err.message,
          }),
        );
      });
  };

  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.setOptions({
      title: "Sign in",
    });
  }, [navigation]);

  if (auth.isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <View className="flex-1 justify-center items-center">
      <View className="bg-slate-200 w-4/5 h-fit p-4 border rounded-lg">
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

        {auth.loading && <Text className="mt-2">Loading...</Text>}

        {auth.errorMessage && (
          <Text className="text-red-500 mt-2">{auth.errorMessage}</Text>
        )}
      </View>
    </View>
  );
}
