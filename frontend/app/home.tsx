import { StyleSheet, Text, View } from "react-native";
import { useUser } from '../context/UserContext';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const userContext = useUser();

  if (!userContext) {
     return <Text>Could not load user details</Text>
   } 

  const {user} = userContext;
  
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Felparkering API</Text>
      <Text style={styles.welcomeTitle}>Welcome {user?.email}!</Text>
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