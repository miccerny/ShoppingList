package michal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 * Standard API error response returned when a request fails.
 *
 * <p>
 * This class is used to provide a consistent and predictable error structure
 * to the frontend, regardless of the type of exception that occurred.
 * </p>
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemsImageDTO {

    /** Unique identifier of the image. */
    private Long id;

    /** URL that can be used by the frontend to load the image. */
    private String url;

    /** Identifier of the item to which this image belongs. */
    @JsonProperty("items_id")
    private Long itemsId;

}
