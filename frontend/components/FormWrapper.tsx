import { View, Text, StyleSheet } from "react-native";
import "../global.css"

interface FormWrapperProps {
  title?: string;
  backgroundColor?: string;
  children: React.ReactNode;
}

export default function FormWrapper({ title, backgroundColor, children }: FormWrapperProps) {
    return (
        <View className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md">
            <View className="px-6 py-4">
                <View className="flex justify-center mx-auto">
                    <Text className="mt-2 text-xl font-medium text-center">{title}</Text>
                </View>
                {children}
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