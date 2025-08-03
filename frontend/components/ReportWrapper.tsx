import Icon from '@expo/vector-icons/Ionicons';
import { View, Text } from "react-native";

interface ReportWrapperProps {
    address: string;
    licensePlate: string;
    violation: string;
    status: string;
}

export default function ReportWrapper({ address, licensePlate, violation, status }: ReportWrapperProps) {
    const getBadgeColor = () => {
        switch (status) {
            case "NEW":
                return "bg-green-600";
            case "ASSIGNED":
                return "bg-yellow-500";
            case "RESOLVED":
                return "bg-gray-500";
            default:
                return "bg-gray-300";
        }
    };
    return (
        <View className="relative bg-white rounded-lg p-4 m-4 mb-4 shadow-sm border shadow-gray-200 border-gray-200">
            <Text className="text-base font-semibold text-gray-900">{address}</Text>
            <Text className="text-sm text-gray-700 mt-1">{violation}</Text>

            <View className="flex-row items-center mt-2">
                <Icon name="car-outline" size={16} className="text-park-icon"/>
                <Text className="ml-1 text-xs text-gray-500">{licensePlate}</Text>
            </View>

            <View className={`absolute top-2 right-2 px-2 py-0.5 rounded-full ${getBadgeColor()}`}>
                <Text className="text-white text-xs font-bold">{status}</Text>
            </View>
        </View>
    );
}
