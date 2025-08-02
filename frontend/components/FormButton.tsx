import { TouchableOpacity, Text } from "react-native";

interface FormButtonProps {
    title: string;
    onPress: () => void;
}

export default function FormButton({ title, onPress }: FormButtonProps) {
    return (
        <TouchableOpacity className="items-center rounded mt-3 mb-3 p-2 bg-park-dark" onPress={onPress}>
            <Text className="text-white">{title}</Text>
        </TouchableOpacity>
    );
}

