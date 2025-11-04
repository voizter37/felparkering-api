import { ScrollView, View, Text } from "react-native";
import AttendantReportWrapper from "../../components/AttendantReportWrapper";
import AttendantLargeReportWrapper from "../../components/AttendantLargeReportWrapper";
import { useCallback, useEffect, useState } from "react";
import { Report } from "../../types/report";
import { router, useFocusEffect } from "expo-router";
import { useApi } from "../../services/api";
import axios from "axios";
import { parkingCategories } from "../../constants/parkingCategories";
import { useUser } from "../../context/UserContext";
import { prettyAddress } from "../../utils/prettyPrinter";
import ReportTable from "../../components/ReportTable";

export default function AvailableReports() {
    const [activeReport, setActiveReport] = useState<Report | null>(null);
    const [newReports, setNewReports] = useState([]);
    const [myReports, setMyReports] = useState([]);

    const api = useApi();
    const {user} = useUser();

    useEffect(() => {
        if (!user) {
              router.replace("/");
        }
    }, [user]);

    useFocusEffect(
        useCallback(() => {
        const fetchNewReports = async () => {
            try {
                const response = await api.getReports();
                setNewReports(response.data);
            } catch (error: any) {
                if (axios.isAxiosError(error) && error.response) {
                    console.log(error.response.data.error);
                }
            }};

            fetchNewReports();
        }, [])
    );

    useFocusEffect(
        useCallback(() => {
        const fetchMyReports = async () => {
            try {
                const response = await api.getReports({assignedTo: user?.email});
                setMyReports(response.data);
            } catch (error: any) {
                if (axios.isAxiosError(error) && error.response) {
                    console.log(error.response.data.error);
                }
            }};

            fetchMyReports();
        }, [])
    );

    return (
        <View className="flex-column h-full bg-park-background">
            <View className="m-4">
                <Text className="text-2xl">My assigned reports</Text>
                <ScrollView className="w-4/6">
                    {myReports.map((report) => {
                        return (
                            <AttendantReportWrapper
                                key={report.id}
                                address={prettyAddress(report.address)} 
                                licensePlate={report.licensePlate} 
                                violation={parkingCategories.find(item => item.value === report.category)?.label ?? "Unknown violation"} 
                                timeStamp={report.createdOn}
                                onPress={() => setActiveReport(report)}
                                selected={activeReport?.address === report.address && activeReport?.licensePlate === report.licensePlate}
                            />
                        );
                    })}
                </ScrollView>
            </View>

            <View className="m-4">
                <Text className="text-2xl">Active reports</Text>  
            </View>

            <View className="flex-row">
                <View className="w-4/6">
                    <ReportTable 
                        columns={["Id", "Address", "Violation", "Status", "Date"]}
                        data={newReports}
                        onRowPress={setActiveReport}
                    />
                </View>
                {activeReport ? ( 
                    <><View className="border my-4 border-slate-200"></View><View className="w-2/6">
                        <AttendantLargeReportWrapper
                            address={prettyAddress(activeReport.address)}
                            hq={activeReport.attendantGroup.name}
                            licensePlate={activeReport.licensePlate}
                            violation={parkingCategories.find(item => item.value === activeReport.category)?.label ?? "Unknown violation"}
                            timeStamp={activeReport.createdOn}
                            coords={[activeReport.address.latitude, activeReport.address.longitude]} />
                    </View></>
                ) : (
                    <></>
                )}
            </View>
        </View>
    )
}