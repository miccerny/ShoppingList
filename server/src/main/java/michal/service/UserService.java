package michal.service;

import michal.dto.UserDTO;
import org.springframework.security.core.userdetails.UserDetailsService;

/**
 * Service interface for managing users and authentication details.
 */
public interface UserService extends UserDetailsService {

    /**
     * Creates a new user account.
     *
     * @param userDTO user registration data
     * @return created user
     */
    UserDTO createUser(UserDTO userDTO);

    /**
     * Returns data of the currently logged-in user.
     *
     * @return current user information
     */
    UserDTO getCurrentUser();
}
