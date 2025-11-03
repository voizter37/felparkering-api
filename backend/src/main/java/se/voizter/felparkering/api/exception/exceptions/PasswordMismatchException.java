package se.voizter.felparkering.api.exception.exceptions;

public class PasswordMismatchException extends RuntimeException {
    private final String message;

    public PasswordMismatchException(String message) {
        super(message);
        this.message = message;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
