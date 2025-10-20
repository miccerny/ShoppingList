package michal.service;

import jakarta.servlet.http.HttpServletRequest;
import michal.dto.UserDTO;
import michal.dto.mapper.UserMapper;
import michal.entity.UserEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Service;

/**
 * Service implementation for handling user authentication.
 */
@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserMapper userMapper;

    private final AuthenticationManager authenticationManager;

    public AuthServiceImpl(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    /**
     * Authenticates a user using provided credentials and creates a security session.
     *
     * @param userDTO user credentials (email and password)
     * @param request current HTTP request used for session management
     * @return authenticated user as {@link UserDTO}
     * @throws BadCredentialsException if authentication fails
     */
    @Override
    public UserDTO login(UserDTO userDTO, HttpServletRequest request) {
        // Create authentication token from user credentials
        UsernamePasswordAuthenticationToken authToken =
                new UsernamePasswordAuthenticationToken(userDTO.getEmail(), userDTO.getPassword());

        // Try to authenticate the user
        Authentication auth = authenticationManager.authenticate(authToken);

        // Create a new security context and store authentication
        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(auth);
        SecurityContextHolder.setContext(context);

        // Attach the security context to the current HTTP session
        request.getSession(true)
                .setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, context);

        // Convert authenticated user entity to DTO
        Object principal = auth.getPrincipal();
        if (principal instanceof UserEntity user) {
            return userMapper.toDTO(user);
        }

        // Throw an error if authentication was not successful
        throw new BadCredentialsException("Přihlášení se nezdařilo");
    }
}

