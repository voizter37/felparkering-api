import { useEffect, useState } from "react";
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
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedAddressObj, setSelectedAddressObj] = useState(null);
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [licensePlate, setLicensePlate] = useState("");
    const [violation, setViolation] = useState("");

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [formError, setFormError] = useState<string | null>(null);

    const api = useApi();

    useEffect(() => {
        const delay = setTimeout(() => {
            if (location?.length >= 2) {
                api.searchAddress(location).then((response) => {
                    console.log(response.data);
                    const suggestions = response.data.map((item) => ({
                        index: item.id,
                        label: `${item.street} ${item.houseNumber ?? ""}, ${item.city}`,
                        value: `${item.street} ${item.houseNumber ?? ""}, ${item.city}`,
                        street: item.street,
                        houseNumber: item.houseNumber,
                        city: item.city
                    }))
                    setLocationSuggestions(suggestions);
                });
            } else {
                setLocationSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [location]);

    function validateFields({ location, licensePlate, violation}: { 
        location: string; licensePlate: string; violation: string | null;
    }): Record<string, string> {
        const errors: Record<string, string> = {};

        if (!location?.trim()) errors.location = "Address is required";
        if (!licensePlate.trim()) errors.licensePlate = "License plate is required";

        const isValidViolation = parkingCategories.some(
            (item) => item.value === violation
        );
        if (!violation || !isValidViolation) {
            errors.violation = "Select a valid violation category rom the list";
        }

        if (!selectedLocation) {
            errors.location = "Select a valid address from the list";
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

            console.log(selectedAddressObj);

            await api.createReport({ 
                id: selectedAddressObj.index,
                street: selectedAddressObj.street,
                houseNumber: selectedAddressObj.houseNumber,
                city: selectedAddressObj.city,
                licensePlate, 
                violation
            })

            Toast.show({
                type: 'success',
                text1: 'Report was created!',
                text2: 'Your report has been saved.',
            });

            setLocation(null);
            setSelectedLocation(null);
            setLicensePlate("");
            setViolation(null);

            
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
            <FormDropdown 
                iconName="location-outline"
                items={locationSuggestions}
                placeholder="Address..."
                value={location}
                onChange={value => {
                    setLocation(value);
                    const match = locationSuggestions.find(s => s.value === value);
                    setSelectedLocation(value);
                    setSelectedAddressObj(match);
                }}
                error={fieldErrors.location}
                allowCustomInput={true}
            />
            <FormTextField 
                iconName="car-outline"
                placeholder="License plate..."
                value={licensePlate}
                onChangeText={value => setLicensePlate(value)}
                error={fieldErrors.licensePlate}
            />
            <FormDropdown
                iconName="trail-sign-outline"
                items={parkingCategories} 
                placeholder="Violation category..."
                value={violation}
                onChange={value => setViolation(value)}
                error={fieldErrors.violation}
                allowCustomInput={false}
            />

            {formError && (
                <Text className="text-red-500 text-xs">{formError}</Text>
            )}

            <FormButton title="Create report" onPress={handleSubmit}/>
        </FormWrapper>
    );
}