package michal.service.Exception;

/**
 * Exception thrown when an action requires an authenticated user,
 * but no user is currently logged in.
 *
 * <p>
 * This exception is typically used in service or controller logic
 * to signal that authentication is missing.
 * </p>
 */
public class UserNotLoggedException extends RuntimeException {

    /**
     * Creates a new UserNotLoggedException with a custom message.
     *
     * @param message description of the authentication problem
     */
    public UserNotLoggedException(String message) {
        super(message);
    }
}
