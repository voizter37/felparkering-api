import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { apiService } from "../services/api";

export default function Index() {

const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

async function handleSubmit() {
  try {
    const response = await apiService.login({ email, password });
    const token = response.data.token;

    await AsyncStorage.setItem("token", token);

    console.log(token);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.log(error.response.data.error);
      }
    }
  }
}

  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.loginTitle}>Felparkering API</Text>
        <View style={styles.separator}/>
        
        <TextInput 
          style={styles.textInput} 
          placeholder="E-mail..." 
          placeholderTextColor={"#bdbdbd"} 
          inputMode="email" 
          autoComplete="email"
          value={email}
          onChangeText={value => setEmail(value)}
        />
        <TextInput 
          style={styles.textInput} 
          placeholder="Password..." 
          placeholderTextColor={"#bdbdbd"}
          secureTextEntry={true}
          value={password}
          onChangeText={value => setPassword(value)}
        />
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleSubmit()}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#52796F",
  },
  loginContainer: {
    paddingHorizontal: 75,
    paddingTop: 25,
    paddingBottom: 25,
    borderRadius: 10,
    backgroundColor: '#CAD2C5',
  },
  loginTitle: {
    fontSize: 28,
  },
  separator: {
    marginVertical: 12,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    backgroundColor: 'white',
    padding: 6,
    marginVertical: 6,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#52796F',
    marginTop: 12,
    padding: 8,
  },
  buttonText: {
    color: 'white',
  }
});

