import { useState } from "react";
import FormButton from "./FormButton";
import FormTextField from "./FormTextField";
import FormWrapper from "./FormWrapper";
import { useApi } from "../services/api";
import axios from "axios";


export default function ReportForm() {
    const [location, setLocation] = useState("");
    const [licensePlate, setLicensePlate] = useState("");
    const [violation, setViolation] = useState("");

    const api = useApi();

    async function handleSubmit() {
        try {
            await api.createReport({ location, licensePlate, violation })
        } catch (error: any) {
            if (axios.isAxiosError(error)) {
                if (error.response) {
                    console.log(error.response.data.error);
                }
            }
    }}

    return (
        <FormWrapper title="Report" backgroundColor="#fff">
            <FormTextField 
                iconName="location-outline"
                placeholder="Address..."
                value={location}
                onChangeText={value => setLocation(value)}
            />
            <FormTextField 
                iconName="car-outline"
                placeholder="License plate..."
                value={licensePlate}
                onChangeText={value => setLicensePlate(value)}
            />
            <FormTextField 
                iconName="trail-sign-outline"
                placeholder="Violation type..."
                value={violation}
                onChangeText={value => setViolation(value)}
            />

            <FormButton title="Create report" onPress={handleSubmit}/>
        </FormWrapper>
    );
}