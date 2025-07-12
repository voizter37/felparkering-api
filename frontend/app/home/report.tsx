import { useRouter } from "expo-router";
import { useUser } from "../../context/UserContext";
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import ReportForm from "../../components/ReportForm";


export default function Report() {
    const {user} = useUser();
    const router = useRouter();
    
    useEffect(() => {
        if (!user) {
          router.replace("/");
        }
      }, [user]);

      return (
        <View style={styles.container}>
              <ReportForm /> 
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: "#CAD2C5",
    alignItems: "center",
    justifyContent: 'center',
  },
})