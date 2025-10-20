package michal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object representing a shopping list.
 * <p>
 * Used to transfer list data between backend and frontend.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListDTO {

    /** Unique identifier of the list. */
    @JsonProperty("_id")
    private Long id;

    /** Name of the shopping list. */
    private String name;

    /** ID of the user who owns this list. */
    private Long ownerId;

    /** Number of items contained in this list. */
    private long itemsCount;
}

