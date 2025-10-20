package michal.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Data Transfer Object representing a user.
 * <p>
 * Used to send and receive user information between backend and frontend.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {

    /** Unique identifier of the user. */
    @JsonProperty("_id")
    private Long id;

    /** User email address. Must be in a valid email format. */
    @Email
    private String email;

    /**
     * User password.
     * Must not be blank and must have at least 6 characters.
     */
    @NotBlank(message = "Vyplňte uživatelské heslo")
    @Size(min = 6, message = "Heslo musí mít alespoň 6 znaků")
    private String password;

    /** List of shopping lists that belong to this user. */
    private List<ListDTO> lists;
}
