package se.voizter.felparkering.api.dto;

import java.util.List;

public record AttendantGroupDto(
    String name,
    List<UserAdminDetailDto> attendants
) {}
