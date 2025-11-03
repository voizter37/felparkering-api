package se.voizter.felparkering.api.enums;

public enum Message {
    LOGIN("User logged in successfully"),
    REGISTER("User registered successfully"),
    MISSING_CREDENTIALS("Missing credentials"),
    PASSWORD_MISMATCH("Password and confirmation does not match"),
    USER_EXISTS("User already exists"),
    INVALID_CREDENTIALS("Invalid credentials"),
    USER_NOT_FOUND("User not found"),
    ;

    private final String prettyName;

    Message(String prettyName) {
        this.prettyName = prettyName;
    }

    @Override
    public String toString() {
        return prettyName;
    }
}
