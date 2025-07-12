import { View, StyleSheet, Text } from "react-native";

interface ReportWrapperProps {
    address: string;
    licensePlate: string;
    violation: string;
    status: string;
}

export default function ReportWrapper({ address, licensePlate, violation, status }: ReportWrapperProps) {

    return (
        <View style={styles.container}>
            <Text>{address}</Text>
            <Text>{licensePlate}</Text>
            <Text>{violation}</Text>
            <Text>{status}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        padding: 16,
        width: '100%',
        borderRadius: 12,
        margin: 12,
    }
});