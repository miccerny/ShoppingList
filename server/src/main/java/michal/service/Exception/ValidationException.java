package michal.service.Exception;

import michal.entity.enumy.ImageType;
import michal.entity.enumy.ValidationErrorCode;


/**
 * Exception thrown when input validation fails.
 *
 * <p>
 * This exception is used when user-provided data is invalid,
 * missing, or does not meet application rules.
 * </p>
 */
public class ValidationException extends RuntimeException {

    /**
     * Validation error code describing what went wrong.
     */
    private final ValidationErrorCode code;

    /**
     * Optional image type related to the validation error.
     *
     * <p>
     * This field is mainly used for image-related validation,
     * such as unsupported image formats.
     * </p>
     */
    private final ImageType type;

    /**
     * Creates a new ValidationException with a validation error code.
     *
     * <p>
     * This constructor is used when no image type context is needed.
     * </p>
     *
     * @param code validation error code (e.g. LIST_NAME_EMPTY)
     */
    public ValidationException(ValidationErrorCode code) {
        this(code, null);
    }

    /**
     * Creates a new ValidationException with a validation error code
     * and an optional image type.
     *
     * @param code validation error code
     * @param type image type related to the validation error (may be null)
     */
    public ValidationException(ValidationErrorCode code, ImageType type) {
        this.code = code;
        this.type = type;
    }


    /**
     * Returns the validation error code.
     *
     * @return validation error code
     */
    public ValidationErrorCode getCode() {
        return code;
    }

    /**
     * Returns the related image type, if available.
     *
     * @return image type or null if not applicable
     */
    public ImageType getType(){return type;}

}
