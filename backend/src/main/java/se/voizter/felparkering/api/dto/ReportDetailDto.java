package se.voizter.felparkering.api.dto;

import java.time.Instant;

import se.voizter.felparkering.api.enums.ParkingViolationCategory;
import se.voizter.felparkering.api.enums.Status;

public record ReportDetailDto(
    Long id,
    String location,
    String licensePlate,
    ParkingViolationCategory category,
    Instant createdOn,
    Instant updatedOn,
    Status status
) {}
