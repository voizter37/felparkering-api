import Icon from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { View, Text, TouchableOpacity } from "react-native";

interface AttendantReportWrapperProps {
    address: string;
    licensePlate: string;
    violation: string;
    timeStamp: string;
    onPress?: () => void;
    selected?: boolean;
}

export default function AttendantReportWrapper({ address, licensePlate, violation, timeStamp, onPress, selected }: AttendantReportWrapperProps) {

    const bgColor = selected ? "bg-park-dark" : "bg-white";
    const borderColor = selected ? "border-gray-700" : "border-gray-200";
    const titleText = selected ? "text-white" : "text-gray-900";
    const subText = selected ? "text-gray-200" : "text-gray-700";
    const metaText = selected ? "text-gray-300" : "text-gray-500";
    const timestampText = selected ? "text-gray-100" : "text-gray-500";

    return (
        <TouchableOpacity className={`relative ${bgColor} rounded-lg p-4 mx-4 mt-4 shadow-sm border shadow-gray-200 ${borderColor}`} onPress={onPress}>
                <Text className={`text-sm font-semibold ${titleText}`}>{address}</Text>
                <Text className={`text-sm ${subText} mt-1`}>{violation}</Text>

                <View className="flex-row items-center mt-2">
                    <Icon name="car-outline" size={16} color={selected ? "#D1D5DB" : "#979797"}/>
                    <Text className={`ml-1 text-xs ${metaText}`}>{licensePlate}</Text>
                </View>

                <View className="flex-row justify-end">
                    <Text className={`text-xs font-semibold italic ${timestampText} mt-2`}>Created: {timeStamp}</Text>
                </View>
        </TouchableOpacity>
    );
}
