import { ScrollView, View, Text } from "react-native";
import AttendantReportWrapper from "../../components/AttendantReportWrapper";

export default function AvailableReports() {

    return (
        <View 
            className="flex-row h-full"
        >
            <ScrollView
                className="w-1/4 bg-[#CAD2C5]"
            >
                <AttendantReportWrapper 
                    address="Timmervägen 37, Östersund"
                    violation="Parkeringsförbud"
                    licensePlate="ABC123"
                    timeStamp="2025-07-29"
                />
            </ScrollView>
            <View
                className="w-3/4 bg-[#84A98C]"
            >
                
            </View>
        </View>
    )
}