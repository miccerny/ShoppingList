package michal.entity.repository;

import michal.dto.UserDTO;
import michal.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

       Optional<UserEntity> findByEmail(String username);
}
