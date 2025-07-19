import { useState } from "react";
import FormButton from "./FormButton";
import FormTextField from "./FormTextField";
import FormWrapper from "./FormWrapper";
import { useApi } from "../services/api";
import { Text } from "react-native";
import Toast from 'react-native-toast-message';
import FormDropdown from "./FormDropdown";
import { parkingCategories } from "../types/parkingCategories";


export default function ReportForm() {
    const [location, setLocation] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    const [violation, setViolation] = useState("");

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string | null>(null);

    const api = useApi();

    function validateFields({ location, licensePlate, violation}: { 
        location: string; licensePlate: string; violation: string | null;
    }): Record<string, string> {
        const errors: Record<string, string> = {};

        if (!location.trim()) errors.location = "Violation is required";
        if (!licensePlate.trim()) errors.licensePlate = "License plate is required";

        const isValidViolation = parkingCategories.some(
            (item) => item.value === violation
            
        );

        if (!violation || !isValidViolation) {
            errors.violation = "Select a valid violation category";
        }

        return errors;
    }

    async function handleSubmit() {
        try {
            setFieldErrors({});
            setFormError(null);
            
            const errors = validateFields({ location, licensePlate, violation })

            

            if (Object.keys(errors).length > 0) {
                setFieldErrors(errors);
                return;
            }

            await api.createReport({ location, licensePlate, violation })
            Toast.show({
                type: 'success',
                text1: 'Report was created!',
                text2: 'Your report has been saved.',
            });

            setLocation("");
            setLicensePlate("");
            setViolation("");

            
        } catch (error: any) {
            const errors = error.response?.data?.errors;
            if (Array.isArray(errors)) {
                const newFieldErrors: Record<string, string> = {};
                errors.forEach(e => {
                    newFieldErrors[e.field] = e.message;
                });
                setFieldErrors(newFieldErrors);
            } else {
                setFormError("Report creation failed, please check your credentials.");
            }
    }}

    return (
        <FormWrapper title="Report">
            <FormTextField 
                iconName="location-outline"
                placeholder="Address..."
                value={location}
                onChangeText={value => setLocation(value)}
                error={fieldErrors.location}
            />
            <FormTextField 
                iconName="car-outline"
                placeholder="License plate..."
                value={licensePlate}
                onChangeText={value => setLicensePlate(value)}
                error={fieldErrors.licensePlate}
            />
            <FormDropdown
                items={parkingCategories} 
                placeholder="Violation category..."
                value={violation}
                onChange={value => setViolation(value)}
                iconName="trail-sign-outline"
                error={fieldErrors.violation}
            />

            {formError && (
                <Text className="text-red-500 text-xs">{formError}</Text>
            )}

            <FormButton title="Create report" onPress={handleSubmit}/>
        </FormWrapper>
    );
}