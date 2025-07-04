import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Login from "./components/Login";
import Register from "./components/Register";

export default function Index() {
  
  const [register, toggleRegister] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Felparkering API</Text>
      <View style={styles.windowContainer}>
        {register ? <Register toggle={toggleRegister}/> : <Login toggle={toggleRegister}/>}
      </View>
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
  windowContainer: {
    flex: 1,
    justifyContent: "center",
  }
});