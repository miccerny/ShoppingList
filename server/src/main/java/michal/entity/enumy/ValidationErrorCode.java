package michal.entity.enumy;

/**
 * Enumeration of validation error codes with user-friendly messages.
 *
 * <p>
 * Each enum constant represents a specific validation error
 * that can occur in the application (e.g. empty name, invalid image type).
 * </p>
 *
 * <p>
 * The enum also stores a human-readable message that can be
 * directly returned to the client or used in error responses.
 * </p>
 */
public enum ValidationErrorCode {
    /** List name must not be empty. */
    LIST_NAME_EMPTY("Název nesmí být prázdný"),
    /** Item name must not be empty. */
    ITEM_NAME_EMPTY("Název nesmí být prázdný"),
    /** Item count must be greater than zero. */
    ITEM_COUNT_EMPTY("Počet nesmí být nula"),
    /** Uploaded image has an unsupported file type. */
    IMAGE_TYPE_NOT_ALLOWED("Nepodporovaný typ obrázku"),
    /** Uploaded image exceeds the allowed size limit. */
    IMAGE_TOO_LARGE("Obrázek je příliš velký");

    /**
     * Default validation message associated with the error code.
     */
    private String message;

    /**
     * Creates a new validation error code with a predefined message.
     *
     * @param message user-friendly validation message
     */
    ValidationErrorCode(String message){
        this.message = message;
    }

    /**
     * Returns the validation message for this error code.
     *
     * @return validation message as String
     */
    public String getMessage(){
        return message;
    }
}
