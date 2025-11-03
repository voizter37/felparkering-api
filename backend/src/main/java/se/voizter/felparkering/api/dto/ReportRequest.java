package se.voizter.felparkering.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import se.voizter.felparkering.api.enums.ParkingViolationCategory;

public record ReportRequest(
    @NotNull(message = "Id is required")
    Long id,

    @NotBlank(message = "Street is required")
    String street,

    String houseNumber,

    @NotBlank(message = "City is required")
    String city,

    @NotBlank(message = "License plate is required")
    @Pattern(regexp = "^[a-zA-Z]{3}[0-9]{2}[a-zA-Z0-9]{1}$", message = "License plate is invalid")
    String licensePlate,

    @NotNull(message = "Violation is required")
    ParkingViolationCategory category
) {}

