import { useState } from "react";
import { Text, View } from "react-native";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function Index() {

    const [register, toggleRegister] = useState(false);

    return (
        <View className="flex-1 items-center bg-park-default">
            <Text className="text-4xl text-white mt-8">Felparkering API</Text>
            <View className="flex-1 justify-center">
                {register ? <RegisterForm toggle={toggleRegister} /> : <LoginForm toggle={toggleRegister} />}
            </View>
        </View>
    );
}
