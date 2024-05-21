import { Link, Redirect } from "expo-router";
import { Text, View, TextInput, Button } from "react-native";
import React from "react";
import useAuthReducer, { AuthStatus, AuthStatusAction } from "@/hooks/useAuthReducer";
import registerWithEmail from "@/api/auth/registerWithEmail";

type FormData = {
  email: string;
  password: string;
  displayName: string;
}

export default function Register() {

  const [authStatus, dispatchAuthStatus]: [AuthStatus, React.Dispatch<AuthStatusAction>] = React.useReducer(
    useAuthReducer(),
    { data: "NOT_AUTHENTICATED", error_message: null }
  );

  const [formData, setFormData] = React.useState<FormData>({email: "", password: "", displayName: ""});

  const onSubmit = () => {
    dispatchAuthStatus({ type: "SIGN_IN", error_message: null });

    registerWithEmail(formData.email, formData.password, formData.displayName)
      .then(() => dispatchAuthStatus({ type: "SIGN_IN_SUCCESS", error_message: null }))
      .catch((error: { message: any; }) => dispatchAuthStatus({ type: "ERROR", error_message: error?.message }));
  };
  
  if (authStatus.data === "AUTHENTICATED") {
    return <Redirect href="/" />
  }

  return (
    <View className="flex-1 justify-center items-center">
      <View className="bg-slate-200 w-4/5 h-4/5 p-4 border rounded-lg">
        <Text className="text-2xl mb-2">Register</Text>

        <Text className="mt-2 mb-1">Email</Text>
        <TextInput className="border px-2 rounded" placeholder="email"
          onChangeText={input => setFormData({...formData, email: input})}/>

        <Text className="mt-2 mb-1">Password</Text>
        <TextInput className="border px-2 rounded" placeholder="password" secureTextEntry={true}
          onChangeText={input => setFormData({...formData, password: input})}/>

<       Text className="mt-2 mb-1">Display Name</Text>
        <TextInput className="border px-2 rounded" placeholder="display name"
          onChangeText={input => setFormData({...formData, displayName: input})}/>
        
        <View className="mt-4 w-1/4">
          <Button title="Submit" onPress={onSubmit}/>
        </View>

        <Link href="/signin" className="mt-2 font-medium text-blue-600 dark:text-blue-500 underline">
          Already have an account? Sign in
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
