import { Text } from "react-native";
import { useUser } from "../../context/UserContext";
import { useEffect } from "react";
import { router } from "expo-router";

export default function Dashboard() {

    const {user} = useUser();
    
    

    
    
    return (
        <Text>Welcome to the dashboard!</Text>
    );
    
}
