package michal.entity.repository;

import michal.entity.ListEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for {@link ListEntity}.
 *
 * <p>
 * This repository provides database access methods for shopping lists.
 * It extends {@link JpaRepository}, which already contains basic CRUD operations.
 * </p>
 */
@EnableJpaRepositories
@Repository
public interface ListRepository extends JpaRepository<ListEntity, Long> {

    /**
     * Finds all lists owned by a specific user.
     *
     * @param userId of the list owner
     * @return list of {@link ListEntity} objects belonging to that user
     */
    @Query("""
    select distinct l
    from lists l
    left join SharedListEntity s on s.list.id = l.id
    where l.owner.id = :userId or s.user.id = :userId
    order by l.id
    """)
    List<ListEntity> findAllUserAccessibleLists(Long userId);

    boolean existsByIdAndOwnerId(Long listId, Long ownerId);
}