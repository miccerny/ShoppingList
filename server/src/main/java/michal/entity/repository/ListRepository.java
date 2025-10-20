package michal.entity.repository;

import michal.entity.ListEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for managing {@link ListEntity} data.
 * <p>
 * Extends {@link JpaRepository} to provide basic CRUD operations.
 */
@EnableJpaRepositories
@Repository
public interface ListRepository extends JpaRepository<ListEntity, Long> {

    /**
     * Finds all lists owned by a specific user.
     *
     * @param ownerId ID of the list owner
     * @return list of {@link ListEntity} objects belonging to that user
     */
    List<ListEntity> findByOwner_Id(Long ownerId);
}