package se.voizter.felparkering.api.exception;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(MethodArgumentNotValidException.class) 
    public ResponseEntity<?> handleValidationErrors(MethodArgumentNotValidException exception) {
        List<Map<String,String>> errors = exception.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(error -> Map.of(
                "field", error.getField(),
                "message", error.getDefaultMessage()
            ))
            .toList();

        return ResponseEntity.badRequest().body(Map.of("errors", errors));
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<?> handleEnumMismatch(MethodArgumentTypeMismatchException exception) {
        Class<?> requiredType = exception.getRequiredType();

        if (requiredType != null && requiredType.isEnum()) {
            String enumValues = String.join(", ", Arrays.stream(requiredType.getEnumConstants()).map(Object::toString).toArray(String[]::new));

            String message = String.format("Invalid value '%s' for enum %s. Allowed values are: [%s]", exception.getValue(), requiredType.getSimpleName(), enumValues);

            return ResponseEntity
                .badRequest()
                .body(Map.of("error", message));
        }

        return ResponseEntity
            .badRequest()
            .body(Map.of("error", "Invalid request parameter or value"));
    }
}
