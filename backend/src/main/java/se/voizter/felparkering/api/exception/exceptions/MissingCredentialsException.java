package se.voizter.felparkering.api.exception.exceptions;

public class MissingCredentialsException extends RuntimeException {
    private final String message;

    public MissingCredentialsException(String message) {
        super(message);
        this.message = message;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
