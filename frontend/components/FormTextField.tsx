import Icon from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { TextInput, TextInputProps, View, StyleSheet } from "react-native";

interface FormTextFieldProps extends TextInputProps {
  iconName?: any;
}

export default function FormTextField({ iconName, ...props }: FormTextFieldProps) {
    const [focused, setFocused] = useState(false);

    return (
        <View 
            className={`w-full flex-row items-center border rounded m-2 px-4 py-2 ${
                focused ? "border-blue-500" : "border-gray-300"
            }`}
        >
            {iconName && <Icon name={iconName} size={20} style={styles.icon}/>}
            <TextInput
                placeholderTextColor={"#bdbdbd"}
                className="flex-1 text-gray-800 bg-transparent focus:outline-none"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
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
        borderColor:  '#d8d8d8',
        borderWidth: 2,
        borderRadius: 4,
        padding: 8,
        marginVertical: 6,
    },
})