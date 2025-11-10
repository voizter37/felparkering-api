package se.voizter.felparkering.api.dto;

import se.voizter.felparkering.api.enums.Status;

public record UpdateStatusRequest(Status status) {}
