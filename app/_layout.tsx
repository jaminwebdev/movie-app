import React from "react";
import { Stack } from "expo-router";
import "./globals.css"
import { StatusBar } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar hidden={true} />

      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)"  />
        <Stack.Screen name="movies/[id]"/>
      </Stack>
    </QueryClientProvider>
  ) 
}
