import { StyleSheet, TouchableOpacity, Text } from "react-native";

interface FormButtonProps {
    title: string;
    onPress: () => void;
}

export default function FormButton({ title, onPress }: FormButtonProps) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: '#52796F',
        borderRadius: 4,
        marginVertical: 12,
        padding: 8,
    },
    buttonText: {
        color: 'white',
    }
})