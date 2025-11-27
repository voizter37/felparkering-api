package se.voizter.felparkering.api.dto;

import java.time.Instant;

import se.voizter.felparkering.api.enums.ParkingViolationCategory;
import se.voizter.felparkering.api.enums.Status;
import se.voizter.felparkering.api.model.Address;
import se.voizter.felparkering.api.model.AttendantGroup;

public record ReportDetailDto(
    Long id,
    Address address,
    String licensePlate,
    ParkingViolationCategory category,
    AttendantGroup attendantGroup,
    Long assignedToId,
    Instant createdOn,
    Instant updatedOn,
    Status status
) {}
