import { Link, Redirect } from "expo-router";
import { Text, View, TextInput, Button } from "react-native";
import getUser from "@/utils/getUser";
import React from "react";
import signInWithEmail from "@/api/auth/signInWithEmail";
import useAuthReducer, { AuthStatus, AuthStatusAction } from "@/hooks/useAuthReducer";

type FormData = {
  email: string;
  password: string;
}

export default function SignIn() {

  const [authStatus, dispatchAuthStatus]: [AuthStatus, React.Dispatch<AuthStatusAction>] = useAuthReducer({
    data: getUser() === null ? "NOT_AUTHENTICATED" : "AUTHENTICATED",
    error_message: null
  });

  const [formData, setFormData] = React.useState<FormData>({email: "", password: ""});

  const onSubmit = () => {
    dispatchAuthStatus({ type: "SIGN_IN", error_message: null });

    signInWithEmail(formData.email, formData.password)
      .then(() => dispatchAuthStatus({ type: "SIGN_IN_SUCCESS", error_message: null }))
      .catch(error => dispatchAuthStatus({ type: "ERROR", error_message: error.message }));
  }
  
  if (authStatus.data === "AUTHENTICATED") {
    return <Redirect href="/" />
  }

  return (
    <View className="flex-1 justify-center items-center">
      <View className="bg-slate-200 w-4/5 h-4/5 p-4 border rounded-lg">
        <Text className="text-2xl mb-2">Sign in</Text>

        <Text className="mt-2 mb-1">Email</Text>
        <TextInput className="border px-2 rounded" placeholder="email"
          onChangeText={input => setFormData({...formData, email: input})}/>

        <Text className="mt-2 mb-1">Password</Text>
        <TextInput className="border px-2 rounded" placeholder="password" secureTextEntry={true}
          onChangeText={input => setFormData({...formData, password: input})}/>
        
        <View className="mt-4 w-1/4">
          <Button title="Submit" onPress={onSubmit}
            disabled={formData.email === "" || formData.password === ""}/>
        </View>

        <Link href="/resetpassword" className="mt-2 font-medium text-blue-600 dark:text-blue-500 underline">
          Forget your password? Reset
        </Link>

        <Link href="/register" className="mt-2 font-medium text-blue-600 dark:text-blue-500 underline">
          Don't have an account? Register
        </Link>

        {authStatus.data === "LOADING" && (
          <Text className="mt-2">Loading...</Text>
        )}

        {authStatus.error_message && (
          <Text className="text-red-500 mt-2">{authStatus.error_message}</Text>
        )}
      </View>
    </View>
  );
}
