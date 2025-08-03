import { Stack } from "expo-router";
import { UserProvider } from "../context/UserContext";
import AuthRedirector from "../components/AuthRedirector";

export default function RootLayout() {
  	return (
		<UserProvider>
			<AuthRedirector />
			<Stack screenOptions={{
				headerShown: false,
			}}>
				<Stack.Screen name="index" options={{ headerShown: false }} />
				<Stack.Screen name="home" options={{ headerShown: false }} />
				<Stack.Screen name="attendant" options={{ headerShown: false }} />
				<Stack.Screen name="admin" options={{ headerShown: false }} />
			</Stack>  
		</UserProvider>
  	);
}
