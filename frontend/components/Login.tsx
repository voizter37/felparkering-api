import { apiService } from '../services/api';
import Icon from '@expo/vector-icons/Ionicons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from 'expo-router';
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { decodeJwt } from '../utils/decodeJwt';
import { useUser } from '../context/UserContext';

type LoginProps = {
    toggle: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Login(props: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { setUser } = useUser();

    async function handleSubmit() {
        try {
            const response = await apiService.login({ email, password })
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
        <View style={styles.loginContainer}>
            <Text style={styles.loginTitle}>Login</Text>
            <View style={styles.separator}/>
            <View style={styles.inputContainer}>
            <Icon name="mail-outline" size={20} style={styles.icon}/>
            <TextInput 
                placeholder="E-mail..." 
                placeholderTextColor={"#bdbdbd"} 
                inputMode="email" 
                autoComplete="email"
                value={email}
                onChangeText={value => setEmail(value)}
            />
            </View>
            <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} style={styles.icon}/>
            <TextInput 
                placeholder="Password..." 
                placeholderTextColor={"#bdbdbd"}
                secureTextEntry={true}
                value={password}
                onChangeText={value => setPassword(value)}
            />
            </View>

            <TouchableOpacity 
            style={styles.button}
            onPress={() => handleSubmit()}
            >
            <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <Text>Don't have an account? <Text style={styles.linkText} onPress={() => {props.toggle(true)}}>
                Sign up here!
            </Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    loginContainer: {
        paddingHorizontal: 75,
        paddingTop: 25,
        paddingBottom: 25,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    loginTitle: {
        alignSelf: 'center',
        fontSize: 28,
    },
    separator: {
        marginVertical: 12,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    icon: {
        marginRight: 5,
        color: "#979797",
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        borderRadius: 4,
        padding: 8,
        marginVertical: 6,
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#52796F',
        borderRadius: 4,
        marginVertical: 12,
        padding: 8,
    },
    buttonText: {
        color: 'white',
    },
    linkText: {
        color: '#537c80',
    }
})