package michal.service;

import michal.dto.UserDTO;
import michal.dto.mapper.UserMapper;
import michal.entity.UserEntity;
import michal.entity.repository.UserRepository;
import michal.service.Exception.DuplicateEmailException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDTO createUser(UserDTO userDTO){
        try {
            UserEntity userEntity = new UserEntity();
            userEntity.setEmail(userDTO.getEmail());
            userEntity.setPassword((passwordEncoder.encode(userDTO.getPassword())));

            userEntity = userRepository.save(userEntity);

            UserDTO dto = new UserDTO();
            dto.setId(userEntity.getId());
            dto.setEmail(userDTO.getEmail());
            return dto;
        }catch (DataIntegrityViolationException e){
            throw new DuplicateEmailException();
        }
    }

    @Override
    public UserDetails loadUserByUsername(String username){
        return userRepository.findByEmail(username).
                orElseThrow(() -> new UsernameNotFoundException("Username " + username + " not found"));
    }
}
