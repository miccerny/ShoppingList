package michal.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import michal.dto.UserDTO;
import michal.service.AuthService;
import michal.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * This controller handles all user-related actions such as registration, login, and getting the current user.
 * <p>
 * It communicates with {@link UserService} for user management and {@link AuthService} for authentication.
 * <p>
 * All endpoints start with /api and return user information as {@link UserDTO}.
 */
@RestController
@RequestMapping("/api")
public class UserController {

    // Service that manages user creation and user data
    @Autowired
    private UserService userService;

    // Service responsible for authentication logic (login, session handling, etc.)
    @Autowired
    private AuthService authService;

    /**
     * Register a new user.
     * Example request: POST /api/register
     * <p>
     * The request body must contain valid user data (for example username, email, password).
     *
     * @param userDTO the user data sent from the frontend
     * @return the created user as DTO
     */
    @PostMapping({"/register", "/register/"})
    public UserDTO addUser(@RequestBody @Valid UserDTO userDTO) {
        // Calls the service to create a new user in the database
        return userService.createUser(userDTO);
    }

    /**
     * Log in an existing user.
     * Example request: POST /api/login
     * <p>
     * The method checks user credentials and starts a new session if the login is successful.
     *
     * @param userDTO  the user login data (usually email and password)
     * @param request  the HTTP request used for managing the session
     * @return the logged-in user as DTO
     */
    @PostMapping("/login")
    public UserDTO login(@RequestBody @Valid UserDTO userDTO, HttpServletRequest request) {
        // Calls the auth service to perform login and handle session or cookies
        return authService.login(userDTO, request);
    }

    /**
     * Get information about the currently logged-in user.
     * Example request: GET /api/me
     * <p>
     * If no user is logged in, the request will return an unauthorized error (handled by security config).
     *
     * @return the current user as DTO
     */
    @GetMapping("/me")
    public UserDTO currentUser() {
        // Calls the service to get data of the currently logged-in user
        return userService.getCurrentUser();
    }
}
