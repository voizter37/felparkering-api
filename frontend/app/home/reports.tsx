import Icon from '@expo/vector-icons/Ionicons';
import { useCallback, useEffect, useState } from "react";
import { useApi } from "../../services/api";
import axios from "axios";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import ReportWrapper from "../../components/ReportWrapper";
import { useUser } from '../../context/UserContext';
import { useFocusEffect, useRouter } from 'expo-router';
import { parkingCategories } from '../../types/parkingCategories';


export default function Reports() {
    const [reports, setReports] = useState([]);
    const [showArchived, setShowArchived] = useState(false);
    
    const {user} = useUser();
    const router = useRouter();
    const api = useApi();

    useEffect(() => {
        if (!user) {
          router.replace("/");
        }
      }, [user]);
    
    useFocusEffect(
        useCallback(() => {
        const fetchReports = async () => {
            try {
                const response = await api.getAllReports();
                setReports(response.data);
            } catch (error: any) {
                if (axios.isAxiosError(error) && error.response) {
                    console.log(error.response.data.error);
                }
            }};

            fetchReports();
        }, [])
    );

    return (
        <ScrollView className="flex-1 bg-park-background px-4 pt-6">
            <View className="w-full max-w-md mx-auto">
                <Text className="text-2xl font-bold text-center mb-4">Reports</Text>
                <View className="w-[90%] max-w-md mx-auto mb-4">
                    {reports.map((report) => {
                        if (report.status != "RESOLVED") {
                            return (
                                <ReportWrapper
                                key={report.id}
                                address={report.location} 
                                licensePlate={report.licensePlate} 
                                violation={parkingCategories.find(item => item.value === report.category)?.label ?? "Unknown violation"} 
                                status={report.status}
                                />
                            );
                        }
                    })}
                </View>

            <TouchableOpacity
                className="flex-row items-center justify-between px-4 py-2 rounded-lg bg-park-background"
                onPress={() => setShowArchived(!showArchived)}
            >
                <Text className="text-base font-semibold">Archived reports</Text>
                <Icon name={showArchived ? "chevron-up" : "chevron-down"} size={20} />
            </TouchableOpacity>

            {showArchived && (
                <View>
                    {reports.map((report) => {
                        if (report.status == "RESOLVED") {
                            return (
                                <ReportWrapper 
                                address={report.location} 
                                licensePlate={report.licensePlate} 
                                violation={report.violation} 
                                status={report.status}
                                />
                            );
                        }
                    })}
                </View>
                )}
            </View>
        </ScrollView>
    );
}