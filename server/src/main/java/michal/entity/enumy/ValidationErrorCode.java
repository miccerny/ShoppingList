package michal.entity.enumy;

public enum ValidationErrorCode {
    LIST_NAME_EMPTY("Název nesmí být prázdný"),
    ITEM_NAME_EMPTY("Název nesmí být prázdný"),
    ITEM_COUNT_EMPTY("Počet nesmí být nula"),
    IMAGE_TYPE_NOT_ALLOWED("Nepodporovaný typ obrázku"),
    IMAGE_TOO_LARGE("Obrázek je příliš velký");

    private String message;

    ValidationErrorCode(String message){
        this.message = message;
    }

    public String getMessage(){
        return message;
    }
}
