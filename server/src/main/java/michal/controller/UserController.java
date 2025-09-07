package michal.controller;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import michal.dto.UserDTO;
import michal.entity.UserEntity;
import michal.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping({"/register", "/register/"})
    public UserDTO addUser(@RequestBody @Valid UserDTO userDTO){
        return userService.createUser(userDTO);
    }

    @PostMapping({"/auth", "/auth/"})
    public UserDTO login(@RequestBody @Valid UserDTO userDTO, HttpServletRequest request) throws ServletException {
        request.login(userDTO.getEmail(), userDTO.getPassword());

        UserEntity userEntity = (UserEntity) SecurityContextHolder.getContext().getAuthentication();
        UserDTO dto = new UserDTO();
        dto.setEmail(userEntity.getEmail());
        dto.setId(userEntity.getId());
        return dto;
    }

    @GetMapping("/auth")
    public UserDTO getCurrentUser() throws ServletException{
        try {
            UserEntity userEntity = (UserEntity) SecurityContextHolder.getContext().getAuthentication();

            UserDTO dto = new UserDTO();
            dto.setEmail(userEntity.getEmail());
            dto.setId(userEntity.getId());
            return dto;
        }catch (ClassCastException e){
            throw new ServletException();
        }
    }

    @DeleteMapping({"/logout", "/logout/"})
    public String logout(HttpServletRequest request) throws  ServletException {
        request.logout();
        return "Uživatel odhlášen";
    }

    @ExceptionHandler(ServletException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public void handleServletException(){

    }
}
