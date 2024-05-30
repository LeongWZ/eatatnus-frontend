import { Stack } from "expo-router";
import React from "react";
import AuthProvider from "@/components/providers/AuthProvider";
import CanteensDataProvider from "@/components/providers/CanteensDataProvider";
import ComposeProviders from "@/components/providers/ComposeProviders";


export default function RootLayout() {
  return (
    <ComposeProviders providers={ [AuthProvider, CanteensDataProvider] }>
      <Stack>
        <Stack.Screen name="(main)/index" />
      </Stack>
    </ComposeProviders>
  );
}
