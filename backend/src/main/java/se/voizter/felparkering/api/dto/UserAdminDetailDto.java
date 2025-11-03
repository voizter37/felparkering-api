package se.voizter.felparkering.api.dto;

import se.voizter.felparkering.api.enums.Role;

public record UserAdminDetailDto(
    String email,
    Role role
) {}
