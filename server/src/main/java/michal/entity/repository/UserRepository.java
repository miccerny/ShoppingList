package michal.entity.repository;

import michal.entity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository interface for managing {@link UserEntity} data.
 * <p>
 * Extends {@link JpaRepository} to provide basic CRUD operations.
 */
@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {

    /**
     * Finds a user by their email address.
     *
     * @param username email of the user
     * @return an {@link Optional} containing the user if found
     */
    Optional<UserEntity> findByEmail(String username);
}
