package michal.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request object used when sharing a shopping list with another user.
 * <p>
 * The frontend sends this DTO as JSON in the request body when the
 * owner of a list decides to share it with another user by email.
 * </p>
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ShareRequestDTO {

    /**
     * Email address of the user who should gain access to the shared list.
     */
    private String email;
}
