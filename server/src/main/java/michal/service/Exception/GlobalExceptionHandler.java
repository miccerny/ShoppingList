package michal.service.Exception;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import michal.dto.ErrorResponse;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for REST controllers.
 * <p>
 * Handles custom application exceptions and returns appropriate HTTP responses.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles {@link EmailValidationException} when a user tries to register with an existing email.
     *
     * @param ex the thrown exception
     * @return HTTP 400 response with error message
     */

    @ExceptionHandler(EmailValidationException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateEmail(EmailValidationException ex) {
        return switch (ex.getType()) {
            case EMAIL_ALREADY_EXISTS ->
                    ResponseEntity
                            .status(HttpStatus.CONFLICT)
                            .body(new ErrorResponse(
                                    "email",
                                    ex.getType().name()
                            ));

            case EMAIL_NOT_FOUND ->
                    ResponseEntity
                            .status(HttpStatus.NOT_FOUND)
                            .body(new ErrorResponse(
                                    "email",
                                    ex.getType().name()
                            ));

            default ->
                    ResponseEntity
                            .status(HttpStatus.BAD_REQUEST)
                            .body(new ErrorResponse(
                                    ex.getMessage(), toString()
                            ));
        };

    }

    @ExceptionHandler(UserNotLoggedException.class)
    public ResponseEntity<Map<String, String>> handleUserNotLogged(UserNotLoggedException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(error);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<?> handleValidation(ValidationException ex) {

        return ResponseEntity.badRequest().body(
                Map.of(
                        "code", ex.getCode().name(),
                        "message", ex.getMessage()
                )
        );
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorResponse> handleForbidden(ForbiddenException ex){
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse("FORBIDDEN",
                        ex.getMessage()));
    }




}
