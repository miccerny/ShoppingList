package michal.service.Exception;

import michal.entity.enumy.EmailValidationError;

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
