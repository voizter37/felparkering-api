import { View, Text, TouchableOpacity } from "react-native";
import WebMap from "./WebMap";
import { cities } from "../types/cities";



interface AttendantLargeReportWrapperProps {
    address: string;
    hq: string;
    licensePlate: string;
    violation: string;
    timeStamp: string;
    coords: [number, number];
}

export default function AttendantLargeReportWrapper({ address, hq, licensePlate, violation, timeStamp, coords }: AttendantLargeReportWrapperProps) {

    function getCityCoordinates(cityName: string) {
        const match = cities.find(c => c.city.toLowerCase() === cityName.toLowerCase());
        return match?.position || null;
    }
    const hqPosition = getCityCoordinates(hq);

    return (
        <View className="relative rounded-lg p-4 m-4 mb-4 shadow-sm border shadow-gray-200 border-gray-200 bg-white">
            <Text className="text-2xl font-semibold pb-4">{address}</Text>
            <View>
                <WebMap adressPosition={coords} hqPosition={[hqPosition.latitude, hqPosition.longitude]}/>
            </View>
            <View className="my-4">
                <Text className="text-xl">{violation}</Text>
                <Text className="text-lg font-light">{licensePlate}</Text>
                <Text>{timeStamp}</Text>
            </View>
            <View className="flex-row justify-between py-4 px-8">
                <TouchableOpacity className="rounded-lg px-12 py-4 bg-green-500">
                    <Text className="text-lg text-white">Accept</Text>
                </TouchableOpacity>
                <TouchableOpacity className="rounded-lg px-12 py-4 bg-red-500"> 
                    <Text className="text-lg text-white">Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
