package michal.service.Exception;

/**
 * Exception thrown when an operation is not allowed for the current user.
 *
 * <p>
 * This exception is typically used to indicate an authorization problem,
 * for example when a user tries to access or modify a resource
 * they do not own or have permission for.
 * </p>
 */
public class ForbiddenException extends RuntimeException {

    /**
     * Creates a new ForbiddenException with a custom message.
     *
     * @param message description of the forbidden operation
     */
    public ForbiddenException(String message) {
        super(message);
    }
}
