import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Home() {
    const [email, setEmail] = useState<string | null>(null);

    useEffect(() => {
    const loadEmail = async () => {
      const storedEmail = await AsyncStorage.getItem("email");
      setEmail(storedEmail);
    };

    loadEmail();
  }, []);
  
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Felparkering API</Text>
      <Text style={styles.welcomeTitle}>Welcome {email}!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#52796F",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 48,
    color: '#fff',
    marginTop: 32,
  },
  welcomeTitle: {
    fontSize: 24,
    color: '#fff',
  }
});