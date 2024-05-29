import { Link, Redirect } from "expo-router";
import { Text, View, TextInput, Button } from "react-native";
import React, { useContext } from "react";
import registerWithEmail from "@/api/auth/registerWithEmail";
import AuthContext from "@/contexts/AuthContext";

type FormData = {
  email: string;
  password: string;
  displayName: string;
}

export default function Register() {
  const { auth, dispatchAuth } = useContext(AuthContext);

  const [formData, setFormData] = React.useState<FormData>({email: "", password: "", displayName: ""});

  const onSubmit = () => {
    dispatchAuth({ type: "SIGN_IN", error_message: null });

    registerWithEmail(formData.email, formData.password, formData.displayName)
      .catch(error => dispatchAuth({ type: "ERROR", error_message: error?.message }));
  };
  
  if (auth.status === "AUTHENTICATED") {
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
          <Button title="Submit" onPress={onSubmit}
            disabled={formData.email === "" || formData.password === "" || formData.displayName === ""}/>
        </View>

        <Link href="/signin" className="mt-2 font-medium text-blue-600 dark:text-blue-500 underline">
          Already have an account? Sign in
        </Link>

        {auth.status === "LOADING" && (
          <Text className="mt-2">Loading...</Text>
        )}

        {auth.error_message && (
          <Text className="text-red-500 mt-2">{auth.error_message}</Text>
        )}
      </View>
    </View>
  );
}
