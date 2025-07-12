import { Stack } from "expo-router";
import {Text, TouchableOpacity } from "react-native";
import { UserProvider } from "../context/UserContext";

export default function RootLayout() {
  return (
    <UserProvider>
      <Stack screenOptions={{
        headerStyle: {
          backgroundColor: '#52796F'
        },
        headerTitleAlign: 'center',
        headerTintColor: '#fff',
        headerLeft: () => <Text style={{color: '#fff', marginLeft: 20, fontSize: 18}}>Felparkering API</Text>,
        headerRight: () => <TouchableOpacity><Text style={{color: '#fff', marginRight: 20, fontSize: 14}}>Log out</Text></TouchableOpacity>
      }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ title: "Home" }} />
      </Stack>  
    </UserProvider>
    );
}
