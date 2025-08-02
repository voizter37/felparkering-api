import { ScrollView, View, Text } from "react-native";
import AttendantReportWrapper from "../../components/AttendantReportWrapper";
import AttendantLargeReportWrapper from "../../components/AttendantLargeReportWrapper";
import { useCallback, useState } from "react";
import { Report } from "../../types/Report";
import { useFocusEffect } from "expo-router";
import { useApi } from "../../services/api";
import axios from "axios";
import { parkingCategories } from "../../types/parkingCategories";

export default function AvailableReports() {
    const [activeReport, setActiveReport] = useState<Report | null>(null);
    const [newReports, setNewReports] = useState([]);

    const api = useApi();

    useFocusEffect(
        useCallback(() => {
        const fetchNewReports = async () => {
            try {
                const response = await api.getAllReports();
                setNewReports(response.data);
                console.log(response.data);
            } catch (error: any) {
                if (axios.isAxiosError(error) && error.response) {
                    console.log(error.response.data.error);
                }
            }};

            fetchNewReports();
        }, [])
    );

    return (
        <View className="flex-row h-full bg-park-background">
            <ScrollView className="w-1/4">
                {newReports.map((report) => {
                    return (
                        <AttendantReportWrapper
                            key={report.id}
                            address={report.location} 
                            licensePlate={report.licensePlate} 
                            violation={parkingCategories.find(item => item.value === report.category)?.label ?? "Unknown violation"} 
                            timeStamp={report.createdOn}
                            onPress={() => setActiveReport(report)}
                            selected={activeReport?.location === report.location && activeReport?.licensePlate === report.licensePlate}
                        />
                    );
                })}
            </ScrollView>
            <View className="w-3/4">
                {activeReport ? (<AttendantLargeReportWrapper 
                    address={activeReport.location}
                    licensePlate={activeReport.licensePlate}
                    violation={parkingCategories.find(item => item.value === activeReport.category)?.label ?? "Unknown violation"}
                    timeStamp={activeReport.createdOn}
                    coords={[activeReport.latitude, activeReport.longitude]}      
                />
                ) : (
                    <View className="flex-1 rounded-lg items-center justify-center m-4 p-4 bg-gray-300">
                        <Text className="text-3xl">Select a report...</Text>
                    </View>
                )}   

            </View>
        </View>
    )
}