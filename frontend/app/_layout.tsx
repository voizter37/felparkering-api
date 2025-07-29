import { Stack } from "expo-router";
import {Text, TouchableOpacity } from "react-native";
import { UserProvider } from "../context/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{
        headerShown: false,
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
      </Stack>  
    </UserProvider>
    );
}
