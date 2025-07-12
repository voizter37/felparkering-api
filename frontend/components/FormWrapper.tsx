import { View, Text, StyleSheet } from "react-native";

interface FormWrapperProps {
  title?: string;
  backgroundColor?: string;
  children: React.ReactNode;
}

export default function FormWrapper({ title, backgroundColor, children }: FormWrapperProps) {
    return (
        <View style={[{backgroundColor: backgroundColor || "#CAD2C5"}, styles.container]}>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.separator}/>
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 75,
        paddingTop: 25,
        paddingBottom: 25,
        borderRadius: 10,
    },
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