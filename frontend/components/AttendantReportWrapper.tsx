import Icon from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { View, Text, TouchableOpacity } from "react-native";

interface AttendantReportWrapperProps {
    address: string;
    licensePlate: string;
    violation: string;
    timeStamp: string;
}

export default function AttendantReportWrapper({ address, licensePlate, violation, timeStamp }: AttendantReportWrapperProps) {

    const [selected, toggleSelected] = useState(false);

    const bgColor = selected ? "bg-[#354F52]" : "bg-white";
    const shadowColor = selected ? "border-gray-900" : "border-gray-200";
    const titleText = selected ? "text-white" : "text-gray-900";
    const subText = selected ? "text-gray-200" : "text-gray-700";
    const metaText = selected ? "text-gray-300" : "text-gray-500";
    const timestampText = selected ? "text-gray-100" : "text-gray-500";

    return (
        <TouchableOpacity onPress={() => toggleSelected(!selected)} onBlur={() => toggleSelected(false)}>
            <View className={`relative ${bgColor} rounded-xl p-4 m-4 mb-4 shadow-sm border ${shadowColor}`}>
                <Text className={`text-sm font-semibold ${titleText}`}>{address}</Text>
                <Text className={`text-sm ${subText} mt-1`}>{violation}</Text>

                <View className="flex-row items-center mt-2">
                    <Icon name="car-outline" size={16} color={selected ? "#d1d5db" : "#6b7280"}/>
                    <Text className={`ml-1 text-xs ${metaText}`}>{licensePlate}</Text>
                </View>

                <View className="flex-row justify-end">
                    <Text className={`text-xs font-semibold italic ${timestampText} mt-2`}>Created: {timeStamp}</Text>
                </View>
                
            </View>
        </TouchableOpacity>
    );
}
