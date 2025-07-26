package se.voizter.felparkering.api.exception;

public class InvalidRequestException extends RuntimeException{
    private final String field;
    private final String message;

    public InvalidRequestException(String field, String message) {
        super(message);
        this.field = field;
        this.message = message;
    }

    public String getField() {
        return field;
    }

    @Override
    public String getMessage() {
        return message;
    }
}
