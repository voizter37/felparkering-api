package se.voizter.felparkering.api.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class ReportRequest {
    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "License plate is required")
    @Pattern(regexp = "^[a-zA-Z]{3}[0-9]{2}[a-zA-Z0-9]{1}$", message = "License plate is invalid")
    private String licensePlate;

    @NotBlank(message = "Violation is required")
    private String violation;

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public String getViolation() {
        return violation;
    }

    public void setViolation(String violation) {
        this.violation = violation;
    }
}
