import { View, Text } from "react-native";
import Icon from '@expo/vector-icons/Ionicons';

interface ChipProps {
    label: string,
    iconName?: any,
}

export default function Chip({label, iconName}: ChipProps) {
    
    return (
        <View className="flex-row items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1">
            {iconName ? <Icon name={iconName} size={16} className="w-4 h-4"/> : null}
            <Text className="text-sm text-slate-700">{label}</Text>
        </View>
    );
}