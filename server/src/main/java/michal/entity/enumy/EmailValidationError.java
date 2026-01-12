package michal.entity.enumy;

/**
 * Enumeration of email validation error types.
 *
 * <p>
 * This enum is used to represent specific reasons why an email address
 * failed validation. It allows the backend to communicate validation
 * errors in a clear and structured way.
 * </p>
 */
public enum EmailValidationError {
    /** Email address is missing or empty. */
    EMAIL_NOT_FOUND,
    /** Email address is already registered in the system. */
    EMAIL_ALREADY_EXISTS,
}
