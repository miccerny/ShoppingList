package michal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ItemsImageDTO {

    private Long id;
    private String url;

    @JsonProperty("items_id")
    private Long itemsId;

}
