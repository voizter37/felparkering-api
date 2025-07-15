import { View, Text, StyleSheet } from "react-native";
import "../global.css"

interface FormWrapperProps {
  title?: string;
  children: React.ReactNode;
}

export default function FormWrapper({ title, children }: FormWrapperProps) {
    return (
        <View className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md min-w-[360px] min-h-[400px]">
            <View className="px-6 py-4 h-full">
                <View className="flex justify-center items-center mb-4">
                    <Text className="mt-2 text-xl font-medium text-center">{title}</Text>
                </View>
                <View className="">
                    {children}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        alignSelf: 'center',
        fontSize: 28,
    },
    separator: {
        marginVertical: 12,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
})