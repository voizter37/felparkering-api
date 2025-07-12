import Icon from '@expo/vector-icons/Ionicons';
import { TextInput, TextInputProps, View, StyleSheet } from "react-native";

interface FormTextFieldProps extends TextInputProps {
  iconName?: any;
}

export default function FormTextField({ iconName, ...props }: FormTextFieldProps) {
    return (
        <View style={styles.inputContainer}>
            {iconName && <Icon name={iconName} size={20} style={styles.icon}/>}
            <TextInput
                placeholderTextColor={"#bdbdbd"}
                {...props}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    icon: {
        marginRight: 5,
        color: "#979797",
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f1f1',
        borderRadius: 4,
        padding: 8,
        marginVertical: 6,
    },
})