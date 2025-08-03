import { useRouter } from "expo-router";
import { useUser } from "../../context/UserContext";
import { useEffect } from "react";
import { View } from "react-native";
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
        <View className="flex-1 items-center justify-center bg-park-background">
              <ReportForm /> 
        </View>
      );
}