package michal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ListDTO {

    @JsonProperty("_id")
    private long id;

    private String name;

    @JsonProperty("owner_id")
    private long ownerId;

    private List<ItemsDTO> items;

}
