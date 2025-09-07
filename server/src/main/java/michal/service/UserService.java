package michal.service;

import michal.dto.UserDTO;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {

    UserDTO createUser(UserDTO userDTO);
}
