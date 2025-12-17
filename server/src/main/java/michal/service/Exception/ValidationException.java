package michal.service.Exception;

import michal.entity.enumy.ValidationErrorCode;

/**
 * Exception thrown when input validation fails.
 * Used for invalid or missing user-provided data.
 */
public class ValidationException extends RuntimeException {

    private final ValidationErrorCode code;
    /**
     * Creates a new ValidationException with an error code.
     *
     * @param code validation error code (e.g. LIST_NAME_EMPTY)
     */
    public ValidationException(ValidationErrorCode code) {
        super(code.name());
        this.code = code;
    }

    public ValidationErrorCode getCode() {
        return code;
    }

}
