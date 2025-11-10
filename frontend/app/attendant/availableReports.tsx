import { View, Text } from "react-native";
import AttendantLargeReportWrapper from "../../components/AttendantLargeReportWrapper";
import { useCallback, useEffect, useState } from "react";
import { Report } from "../../types/report";
import { router, useFocusEffect } from "expo-router";
import { getApiMessage, useApi } from "../../services/api";
import axios from "axios";
import { parkingCategories } from "../../constants/parkingCategories";
import { useUser } from "../../context/UserContext";
import { prettyAddress } from "../../utils/prettyPrinter";
import ReportTable from "../../components/ReportTable";
import Toast from "react-native-toast-message";

export default function AvailableReports() {
    const [activeReport, setActiveReport] = useState<Report | null>(null);
    const [newReports, setNewReports] = useState([]);

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
            }
        };
        fetchNewReports();
        }, [])
    );

    const handleAccept = async () => {
        if (!activeReport) return;

        try {
            const update = await api.updateReport(activeReport.id, { status: "ASSIGNED" });
            console.log(update);
            Toast.show({ type: "success", text1: getApiMessage(update) });
            const res = await api.getReports();
            setNewReports(res.data);
            setActiveReport(null);
        } catch (error) {
            Toast.show({ type: "error", text1: getApiMessage(error) });
        } 
    };

    const handleCancel = () => {
        setActiveReport(null);
    };

    return (
        <View className="flex-column h-full bg-park-background">
            <View className="m-4">
                <Text className="text-2xl">Active reports</Text>  
            </View>

            <View className="flex-row">
                <View className="w-4/6">
                    <ReportTable 
                        columns={["Id", "Address", "Violation", "Status", "Date"]}
                        data={newReports}
                        selected={activeReport}
                        onSelect={setActiveReport}
                    />
                </View>
                {activeReport ? ( 
                    <><View className="border my-4 border-slate-200"></View><View className="w-2/6">
                        <AttendantLargeReportWrapper
                            primaryLabel="Accept"
                            primaryAction={handleAccept}
                            secondaryLabel="Cancel"
                            secondaryAction={handleCancel}
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