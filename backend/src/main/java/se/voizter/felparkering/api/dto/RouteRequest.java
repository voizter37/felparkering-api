package se.voizter.felparkering.api.dto;

import jakarta.validation.constraints.NotNull;

public record RouteRequest(
    @NotNull
    double[] start,

    @NotNull
    double[] end
) {}
