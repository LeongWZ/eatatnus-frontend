import { Stack } from "expo-router";
import React from "react";
import AuthProvider from "@/components/AuthProvider";
import CanteensDataProvider from "@/components/CanteensDataProvider";
import ComposeProviders from "@/components/ComposeProviders";


export default function RootLayout() {
  return (
    <ComposeProviders providers={ [AuthProvider, CanteensDataProvider] }>
      <Stack>
        <Stack.Screen name="(main)/index" />
      </Stack>
    </ComposeProviders>
  );
}
