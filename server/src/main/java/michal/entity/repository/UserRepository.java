package michal.entity.repository;

import michal.dto.UserDTO;
import michal.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

        UserEntity findById(UserDTO userDTO);
}
