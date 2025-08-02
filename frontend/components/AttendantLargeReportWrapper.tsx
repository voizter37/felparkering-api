import { View, Text, TouchableOpacity } from "react-native";
import WebMap from "./WebMap";



interface AttendantLargeReportWrapperProps {
    address: string;
    licensePlate: string;
    violation: string;
    timeStamp: string;
    coords: [number, number];
}

export default function AttendantLargeReportWrapper({ address, licensePlate, violation, timeStamp, coords }: AttendantLargeReportWrapperProps) {

    return (
        <View className="relative rounded-lg p-4 m-4 mb-4 shadow-sm border shadow-gray-200 border-gray-200 bg-white">
            <Text className="text-2xl font-semibold pb-4">{address}</Text>
            <View>
                <WebMap latitude={coords[0]} longitude={coords[1]}/>
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
