package michal.service;

import michal.dto.UserDTO;
import michal.dto.mapper.UserMapper;
import michal.entity.UserEntity;
import michal.entity.enumy.EmailValidationError;
import michal.entity.repository.UserRepository;
import michal.service.Exception.EmailValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Service implementation for managing user accounts and authentication.
 */
@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * Creates a new user with encoded password and saves it to the database.
     *
     * @param userDTO registration data
     * @return created user
     * @throws EmailValidationException if the email already exists
     */
    @Override
    public UserDTO createUser(UserDTO userDTO) {
        try {
            // Map DTO to entity and encode the password
            UserEntity userEntity = new UserEntity();
            userEntity.setEmail(userDTO.getEmail());
            userEntity.setPassword(passwordEncoder.encode(userDTO.getPassword()));

            // Save to database
            userEntity = userRepository.save(userEntity);

            // Map entity back to DTO
            UserDTO dto = new UserDTO();
            dto.setId(userEntity.getId());
            dto.setEmail(userDTO.getEmail());
            return dto;

        } catch (DataIntegrityViolationException e) {
            throw new EmailValidationException(EmailValidationError.EMAIL_ALREADY_EXISTS);
        }
    }

    /**
     * Loads a user by their email address.
     *
     * @param username user email (used as username)
     * @return user details for Spring Security
     * @throws UsernameNotFoundException if user not found
     */
    @Override
    public UserDetails loadUserByUsername(String username) {
        return userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Username " + username + " not found"));
    }

    /**
     * Returns the currently logged-in user.
     *
     * @return current user as {@link UserDTO}
     * @throws UsernameNotFoundException if no user is logged in
     */
    @Override
    public UserDTO getCurrentUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        if (principal instanceof UserEntity user) {
            return userMapper.toDTO(user);
        }
        throw new UsernameNotFoundException("Uživatel není přihlášen");
    }
}