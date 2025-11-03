package se.voizter.felparkering.api.exception.exceptions;

public class UserConflictException extends RuntimeException {
    private final String message;

    public UserConflictException(String message) {
        super(message);
        this.message = message;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
