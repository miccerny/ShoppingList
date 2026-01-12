package michal.service.Exception;

import michal.entity.SharedListEntity;
import michal.entity.enumy.EmailValidationError;

/**
 * Exception thrown when an email address fails validation.
 *
 * <p>
 * This exception is typically used when the provided email
 * does not meet required rules (e.g. invalid format, empty value).
 * </p>
 *
 * <p>
 * It represents a specific type of validation error
 * related only to email input.
 * </p>
 */
public class EmailValidationException extends RuntimeException {

    private final EmailValidationError type;

    public EmailValidationException(EmailValidationError type) {
        super(type.name());
        this.type = type;
    }

    public EmailValidationError getType() {
        return type;
    }
}
