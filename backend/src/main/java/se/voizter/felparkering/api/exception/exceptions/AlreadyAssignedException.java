package se.voizter.felparkering.api.exception.exceptions;

public class AlreadyAssignedException extends RuntimeException {
    private final String message;

    public AlreadyAssignedException(String message) {
        super(message);
        this.message = message;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
