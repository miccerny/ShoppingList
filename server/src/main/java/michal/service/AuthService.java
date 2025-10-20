package michal.service;

import jakarta.servlet.http.HttpServletRequest;
import michal.dto.UserDTO;

/**
 * Service interface for handling user authentication.
 */
public interface AuthService {

    /**
     * Authenticates a user and starts a session.
     *
     * @param userDTO user credentials (email and password)
     * @param request current HTTP request used for session handling
     * @return authenticated user data
     */
    UserDTO login(UserDTO userDTO, HttpServletRequest request);
}
