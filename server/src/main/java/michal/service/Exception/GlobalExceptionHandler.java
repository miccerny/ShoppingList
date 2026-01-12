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
 *
 * <p>
 * This class catches exceptions thrown from controllers/services and converts them
 * into consistent HTTP responses for the client (frontend).
 * </p>
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handles {@link EmailValidationException}.
     *
     * <p>
     * Depending on the {@code type} inside the exception, the handler returns different HTTP statuses.
     * This is useful when the same exception class can represent multiple email-related problems.
     * </p>
     *
     * @param ex thrown exception
     * @return ResponseEntity containing an error response for the client
     */
    @ExceptionHandler(EmailValidationException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateEmail(EmailValidationException ex) {
        // Using "switch" to map exception types to different HTTP status codes and response bodies.
        return switch (ex.getType()) {
            // Email already exists -> conflict (409).
            case EMAIL_ALREADY_EXISTS -> ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse(
                            "email",
                            ex.getType().name()
                    ));

            // Email not found -> not found (404).
            case EMAIL_NOT_FOUND -> ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(new ErrorResponse(
                            "email",
                            ex.getType().name()
                    ));

            // Any other email validation problem -> bad request (40
            default -> ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(
                            ex.getMessage(), toString()
                    ));
        };

    }

    /**
     * Handles {@link UserNotLoggedException}.
     *
     * <p>
     * This exception is typically thrown when an endpoint requires authentication,
     * but the user is not logged in.
     * </p>
     *
     * @param ex thrown exception
     * @return HTTP 401 response with a simple error message map
     */
    @ExceptionHandler(UserNotLoggedException.class)
    public ResponseEntity<Map<String, String>> handleUserNotLogged(UserNotLoggedException ex) {
        // Simple JSON response: { "error": "..." }
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(error);
    }

    /**
     * Handles {@link ValidationException}.
     *
     * <p>
     * Returns a 400 Bad Request response with a validation error code and message.
     * This allows the frontend to display a user-friendly message or map error codes.
     * </p>
     *
     * @param ex thrown exception
     * @return HTTP 400 response containing validation details
     */
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<?> handleValidation(ValidationException ex) {
        // Response example: { "code": "ITEM_NAME_EMPTY", "message": "..." }
        return ResponseEntity.badRequest().body(
                Map.of(
                        "code", ex.getCode().name(),
                        "message", ex.getMessage()
                )
        );
    }

    /**
     * Handles {@link ForbiddenException}.
     *
     * <p>
     * This exception is thrown when a user is authenticated,
     * but does not have permission to perform an operation.
     * </p>
     *
     * @param ex thrown exception
     * @return HTTP 403 response with an error message
     */
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ErrorResponse> handleForbidden(ForbiddenException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(new ErrorResponse("FORBIDDEN",
                        ex.getMessage()));
    }


}
