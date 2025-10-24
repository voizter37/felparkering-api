package se.voizter.felparkering.api.dto;

import jakarta.validation.constraints.NotNull;

public class RouteRequest {
    @NotNull
    private double[] start;

    @NotNull
    private double[] end;

    public double[] getStart() {
        return start;
    }

    public void setStart(double[] start) {
        this.start = start;
    }
    
    public double[] getEnd() {
        return end;
    }

    public void setEnd(double[] end) {
        this.end = end;
    }
}
