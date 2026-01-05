package michal.service.Exception;

import michal.entity.enumy.ImageType;
import michal.entity.enumy.ValidationErrorCode;

/**
 * Exception thrown when input validation fails.
 * Used for invalid or missing user-provided data.
 */
public class ValidationException extends RuntimeException {

    private final ValidationErrorCode code;
    private final ImageType type;

    public ValidationException(ValidationErrorCode code) {
        this(code, null);
    }
    /**
     * Creates a new ValidationException with an error code.
     *
     * @param code validation error code (e.g. LIST_NAME_EMPTY)
     */
    public ValidationException(ValidationErrorCode code, ImageType type) {
        this.code = code;
        this.type = type;
    }

    public ValidationErrorCode getCode() {
        return code;
    }
    public ImageType getType(){return type;}

}
