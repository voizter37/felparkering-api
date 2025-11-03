package se.voizter.felparkering.api.dto;

import java.util.List;

public record AttendantGroupDetailDto(
    String name,
    List<UserAdminDetailDto> attendants
) {}
