package michal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object representing an item in a shopping list.
 * <p>
 * Used to transfer item data between backend and frontend.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemsDTO {

    /** Unique identifier of the item. */
    private Long id;

    /** Name of the item, for example "Milk" or "Bread". */
    private String name;

    /** Quantity or count of the item. */
    private float count;

    /** ID of the list this item belongs to. */
    @JsonProperty("list_id")
    private Long listId;

    /** Indicates whether the item is checked (completed). */
    private boolean purchased;

    private ItemsImageDTO image;
}
