import { Link, Redirect, useNavigation } from "expo-router";
import { Text, View, TextInput, Button } from "react-native";
import React from "react";
import registerWithEmail from "@/api/auth/registerWithEmail";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import {
  loadAuthAction,
  errorAuthAction,
  putUserDataAction,
} from "@/store/reducers/auth";
import createUser from "@/api/users/createUser";

type FormData = {
  email: string;
  password: string;
  displayName: string;
};

export default function Register() {
  const auth = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [formData, setFormData] = React.useState<FormData>({
    email: "",
    password: "",
    displayName: "",
  });

  const onSubmit = () => {
    dispatch(loadAuthAction());

    registerWithEmail(formData.email, formData.password)
      .then(() =>
        createUser(formData.displayName)
          .then((userData) => dispatch(putUserDataAction({ user: userData })))
          .catch((error: Error) => {
            dispatch(
              errorAuthAction({
                errorMessage: error.message,
              }),
            );
          }),
      )
      .catch((err) =>
        dispatch(
          errorAuthAction({
            errorMessage: "Failed to register: " + err.message,
          }),
        ),
      );
  };

  const navigation = useNavigation();
  React.useEffect(() => {
    navigation.setOptions({
      title: "Register",
    });
  }, [navigation]);

  if (auth.isAuthenticated) {
    return <Redirect href="/" />;
  }

  return (
    <View className="flex-1 justify-center items-center">
      <View className="bg-slate-200 w-4/5 h-4/5 p-4 border rounded-lg">
        <Text className="text-2xl mb-2">Register</Text>

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

        <Text className="mt-2 mb-1">Display Name</Text>
        <TextInput
          className="border px-2 rounded"
          placeholder="display name"
          onChangeText={(input) =>
            setFormData({ ...formData, displayName: input })
          }
        />

        <View className="mt-4 w-1/4">
          <Button
            title="Submit"
            onPress={onSubmit}
            disabled={
              formData.email === "" ||
              formData.password === "" ||
              formData.displayName === ""
            }
          />
        </View>

        <Link
          href="/signin"
          className="mt-2 font-medium text-blue-600 dark:text-blue-500 underline"
        >
          Already have an account? Sign in
        </Link>

        {auth.loading && <Text className="mt-2">Loading...</Text>}

        {auth.errorMessage && (
          <Text className="text-red-500 mt-2">{auth.errorMessage}</Text>
        )}
      </View>
    </View>
  );
}
