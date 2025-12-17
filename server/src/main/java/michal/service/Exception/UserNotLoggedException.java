package michal.service.Exception;

public class UserNotLoggedException extends RuntimeException {
    public UserNotLoggedException(String message) {
        super(message);
    }
}
