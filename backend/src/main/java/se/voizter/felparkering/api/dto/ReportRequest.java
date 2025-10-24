package se.voizter.felparkering.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import se.voizter.felparkering.api.type.ParkingViolationCategory;

public class ReportRequest {
    @NotNull(message = "Id is required")
    private Long id;

    @NotBlank(message = "Street is required")
    private String street;

    private String houseNumber;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "License plate is required")
    @Pattern(regexp = "^[a-zA-Z]{3}[0-9]{2}[a-zA-Z0-9]{1}$", message = "License plate is invalid")
    private String licensePlate;

    @NotNull(message = "Violation is required")
    private ParkingViolationCategory violation;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStreet() {
        return street;
    }

    public void setStreet(String street) {
        this.street = street;
    }

    public String getHouseNumber() {
        return houseNumber;
    }

    public void setHouseNumber(String houseNumber) {
        this.houseNumber = houseNumber;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public void setLicensePlate(String licensePlate) {
        this.licensePlate = licensePlate;
    }

    public ParkingViolationCategory getViolation() {
        return violation;
    }

    public void setViolation(ParkingViolationCategory violation) {
        this.violation = violation;
    }
}
