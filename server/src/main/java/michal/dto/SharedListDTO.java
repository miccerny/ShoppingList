package michal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object representing a shared list entry.
 * <p>
 * This DTO is used when returning information about which user
 * has access to a specific shopping list.
 * </p>
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SharedListDTO {

    /**
     * Unique identifier of the shared list relation.
     * <p>
     * Maps to the primary key of the "shared_lists" table.
     * </p>
     */
    @JsonProperty("_id")
    private Long id;

    /**
     * Identifier of the user with whom the list is shared.
     */
    private Long userId;

    /**
     * Email of the user who has access to the shared list.
     */
    private String email;

    /**
     * Identifier of the list that is being shared.
     */
    private Long listId;
}
