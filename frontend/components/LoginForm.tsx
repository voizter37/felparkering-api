import { useApi } from '../services/api';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from 'expo-router';
import { useState } from "react";
import { StyleSheet, Text } from "react-native";
import { decodeJwt } from '../utils/decodeJwt';
import { useUser } from '../context/UserContext';
import FormTextField from './FormTextField';
import FormWrapper from './FormWrapper';
import FormButton from './FormButton';

type LoginProps = {
    toggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Login(props: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const api = useApi();
    const { setUser } = useUser();

    async function handleSubmit() {
        try {
            const response = await api.login({ email, password })
            const token = response.data.token;

            await AsyncStorage.setItem("token", token);

            const decoded = decodeJwt<{ email: string; role: string }>(token);

            if (decoded) {
                setUser({ email: decoded.sub, role: decoded.role });
            }

            router.push("/home");
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.log(error.response.data.error);
                }
            }
    }}

    return (
        <FormWrapper title='Login'>
            <FormTextField 
                iconName="mail-outline"
                placeholder="E-mail..." 
                inputMode="email" 
                value={email}
                onChangeText={value => setEmail(value)}
            />
            <FormTextField 
                iconName="lock-closed-outline"
                placeholder="Password..." 
                secureTextEntry={true}
                value={password}
                onChangeText={value => setPassword(value)}
            />
            
            <FormButton title='Login' onPress={handleSubmit}/>

            <Text>Don't have an account? <Text style={styles.linkText} onPress={() => {props.toggle(true)}}>
                Sign up here!
            </Text>
            </Text>
        </FormWrapper>
    );
}

const styles = StyleSheet.create({
    linkText: {
        color: '#537c80',
    }
})