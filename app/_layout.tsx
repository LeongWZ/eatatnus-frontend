import { Stack } from "expo-router";
import React from "react";
import AuthProvider from "@/components/providers/AuthProvider";
import CanteenCollectionProvider from "@/components/providers/CanteenCollectionProvider";
import ComposeProviders from "@/components/providers/ComposeProviders";
import StallCollectionProvider from "@/components/providers/StallCollectionProvider";
import HoldMenuProvider from "@/components/providers/HoldMenuProvider";

const providers = [
  CanteenCollectionProvider,
  StallCollectionProvider,
  HoldMenuProvider,
  AuthProvider,
];

export default function RootLayout() {
  return (
    <ComposeProviders providers={providers}>
      <Stack>
        <Stack.Screen name="(main)/index" options={{ title: "eat@NUS" }} />
      </Stack>
    </ComposeProviders>
  );
}
