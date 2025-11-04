package se.voizter.felparkering.api.dto;

import jakarta.validation.constraints.NotBlank;

public record UserRequest (
    @NotBlank(message = "Email is required")
    String email
) {}
