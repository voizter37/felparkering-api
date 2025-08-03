import Icon from '@expo/vector-icons/Ionicons';
import { router, Tabs } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { useUser } from "../../context/UserContext";

export default function AttendantLayout() {
    const { logout } = useUser();

    const handleLogout = async () => {
        await logout();
        router.replace("/");
    };

    return (
        <>
        <Tabs
            screenOptions={{
                headerStyle: {
                    backgroundColor: "#52796F",
                },
                headerTitleAlign: "center",
                headerTintColor: "#fff",
                headerLeft: () => (
                    <Text style={{ color: "#fff", marginLeft: 20, fontSize: 18 }}>
                        Felparkering API
                    </Text>
                ),
                headerRight: () => (
                    <TouchableOpacity onPress={handleLogout}>
                        <Text style={{ color: "#fff", marginRight: 20, fontWeight: 'bold', fontSize: 14 }}>
                            Log out
                        </Text>
                    </TouchableOpacity>
                ),
                tabBarActiveTintColor: "#52796F",
            }}
        >
            <Tabs.Screen
                    name="dashboard"
                    options={{
                        title: "Dashboard",
                        tabBarIcon: ({ color, size}) => (
                            <Icon name="document-text-outline" size={size} color={color}/>
                        )
                    }}
                />
        </Tabs>
        </>
    );
}