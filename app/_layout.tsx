import React from "react";
import { useState, useEffect } from "react";
import { Stack } from "expo-router";
import "./globals.css"
import { StatusBar } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserContext } from "../context/UserContext";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const queryClient = new QueryClient();
const USER_ID_KEY = '@movie_app_user_id';

export default function RootLayout() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function initializeUserId() {
      try {
        let id = await AsyncStorage.getItem(USER_ID_KEY);

        if (!id) {
          id = uuidv4();
          await AsyncStorage.setItem(USER_ID_KEY, id);
        }

        setUserId(id);
      } catch (error) {
        console.error('Error initializing userId:', error);
      }
    }

    initializeUserId();
  }, []);

  if (!userId) {
    return null;
  }

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      <QueryClientProvider client={queryClient}>
        <StatusBar hidden={true} />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)"  />
          <Stack.Screen name="movies/[id]"/>
        </Stack>
      </QueryClientProvider>
    </UserContext.Provider>
  );
}
