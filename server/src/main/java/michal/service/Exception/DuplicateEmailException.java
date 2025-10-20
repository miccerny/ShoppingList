package michal.service.Exception;

/**
 * Exception thrown when a user with the same email already exists.
 */
public class DuplicateEmailException extends RuntimeException {

    /**
     * Creates a new {@link DuplicateEmailException} with a custom message.
     *
     * @param message description of the error
     */
    public DuplicateEmailException(String message) {
        super(message);
    }
}
