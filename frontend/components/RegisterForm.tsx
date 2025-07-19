import { useApi } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Text, View } from "react-native";
import { decodeJwt } from '../utils/decodeJwt';
import { useUser } from '../context/UserContext';
import { router } from 'expo-router';
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

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string | null>(null);

    const api = useApi();
    const { setUser } = useUser();

    async function handleSubmit() {
        try {
            setFieldErrors({});
            setFormError(null);

            const response = await api.register({ email, password, confPassword })
            const token = response.data.token;

            await AsyncStorage.setItem("token", token);

            const decoded = decodeJwt<{ email: string; role: string }>(token);
                        
            if (decoded) {
                setUser({ email: decoded.sub, role: decoded.role });
            }
            router.push("/home");
        } catch (error: any) {
            const errors = error.response?.data?.errors;
            if (Array.isArray(errors)) {
                const newFieldErrors: Record<string, string> = {};
                errors.forEach(e => {
                    newFieldErrors[e.field] = e.message;
                });
                setFieldErrors(newFieldErrors);
            } else {
                setFormError("Registration failed, please check your credentials.");
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
                error={fieldErrors.email}
            />
            <FormTextField 
                iconName="lock-closed-outline"
                placeholder="Password..." 
                secureTextEntry={true}
                value={password}
                onChangeText={value => setPassword(value)}
                error={fieldErrors.password}
            />
            <FormTextField 
                iconName="lock-closed-outline"
                placeholder="Confirm password..." 
                secureTextEntry={true}
                value={confPassword}
                onChangeText={value => setConfPassword(value)}
                error={fieldErrors.confPassword}
            />

            {formError && (
                <Text className="text-red-500 text-xs">{formError}</Text>
            )}

            <FormButton title='Sign up' onPress={handleSubmit}/>

            <View className="flex items-center justify-center py-4 text-center bg-gray-50">
                <Text className="text-sm text-gray-600">Already have an account? <Text className="mx-2 text-sm font-bold text-green hover:underline" onPress={() => {props.toggle(false)}}>
                    Login here!
                </Text>
                </Text>
            </View>
            
        </FormWrapper>
    );
}
