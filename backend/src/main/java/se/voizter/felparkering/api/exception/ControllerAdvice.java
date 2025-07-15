package se.voizter.felparkering.api.exception;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ControllerAdvice {
    
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
}
