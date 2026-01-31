package com.samir.travelplanner.exception;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
    @ExceptionHandler(ExternalApiException.class)
    public ResponseEntity<?> handleExternalApiException(ExternalApiException ex) {

        return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body(Map.of("message", ex.getMessage()));
    }
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<String> handleDuplicateDestinationException(DuplicateResourceException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<?> handleBusiness(BusinessException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(error(ex.getMessage()));
    }

    private Map<String, Object> error(String message) {
        return Map.of(
                "timestamp", LocalDateTime.now(),
                "message", message
        );
    }
}
