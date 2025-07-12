import { useApi } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useState } from 'react';
import { StyleSheet, Text } from "react-native";
import { decodeJwt } from '../utils/decodeJwt';
import { useUser } from '../context/UserContext';
import FormTextField from './FormTextField';
import FormWrapper from './FormWrapper';
import FormButton from './FormButton';

type RegisterProps = {
    toggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Register(props: RegisterProps) {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");

    const api = useApi();
    const { setUser } = useUser();

    async function handleSubmit() {
        try {
            const response = await api.register({ email, password, confPassword })
            const token = response.data.token;

            await AsyncStorage.setItem("token", token);

            const decoded = decodeJwt<{ email: string; role: string }>(token);
                        
            if (decoded) {
                setUser({ email: decoded.sub, role: decoded.role });
            }

        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.log(error.response.data.error);
                }
            }
    }}

    return (
        <FormWrapper title='Sign up'>
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
            <FormTextField 
                iconName="lock-closed-outline"
                placeholder="Confirm password..." 
                secureTextEntry={true}
                value={confPassword}
                onChangeText={value => setConfPassword(value)}
            />

            <FormButton title='Sign up' onPress={handleSubmit}/>

            <Text>Already have an account? <Text style={styles.linkText} onPress={() => {props.toggle(false)}}>
                Login here!
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