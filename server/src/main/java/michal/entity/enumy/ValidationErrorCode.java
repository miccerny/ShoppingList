package michal.entity.enumy;

public enum ValidationErrorCode {
    LIST_NAME_EMPTY("Název nesmí být prázdný"),
    ITEM_NAME_EMPTY("Název nesmí být prázdný"),
    ITEM_COUNT_EMPTY("Počet nesmí být nula");

    private String message;

    ValidationErrorCode(String message){
        this.message = message;
    }

    public String getMessage(){
        return message;
    }
}
