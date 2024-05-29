import { Stack } from "expo-router";
import React from "react";
import AuthProvider from "@/components/AuthProvider";


export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(main)/index" />
      </Stack>
    </AuthProvider>
  );
}
