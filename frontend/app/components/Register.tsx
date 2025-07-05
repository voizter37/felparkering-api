import { apiService } from '@/services/api';
import Icon from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Dispatch, SetStateAction, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

type RegisterProps = {
    toggle: Dispatch<SetStateAction<boolean>>;
}

export default function Register(props: RegisterProps) {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");

    async function handleSubmit() {
        try {
            const response = await apiService.register({ email, password, confPassword })
            const token = response.data.token;

            await AsyncStorage.setItem("token", token);
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.log(error.response.data.error);
                }
            }
    }}

    return (
        <View style={styles.loginContainer}>
            <Text style={styles.loginTitle}>Sign up</Text>
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
            <View style={styles.inputContainer}>
            <Icon name="lock-closed-outline" size={20} style={styles.icon}/>
            <TextInput 
                placeholder="Confirm password..." 
                placeholderTextColor={"#bdbdbd"}
                secureTextEntry={true}
                value={confPassword}
                onChangeText={value => setConfPassword(value)}
            />
            </View>

            <TouchableOpacity 
            style={styles.button}
            onPress={() => handleSubmit()}
            >
            <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity>

            <Text>Already have an account? <Text style={styles.linkText} onPress={() => {props.toggle(false)}}>
                Login here!
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