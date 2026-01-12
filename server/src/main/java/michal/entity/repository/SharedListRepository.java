package michal.entity.repository;

import michal.entity.SharedListEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Repository interface for {@link SharedListEntity}.
 *
 * <p>
 * This repository is responsible for database operations related
 * to shared shopping lists.
 * </p>
 *
 * <p>
 * It allows working with users who have access to a list
 * that is owned by another user.
 * </p>
 */
@Repository
public interface SharedListRepository extends JpaRepository<SharedListEntity, Long> {

    /**
     * Finds all shared list entries for a specific list.
     *
     * <p>
     * This method is typically used to load all users
     * who have access to a given shopping list.
     * </p>
     *
     * @param listId ID of the shopping list
     * @return list of shared list relations for the given list
     */
    List<SharedListEntity> findByListId(Long listId);

    /**
     * Checks whether a list is already shared with a specific user.
     *
     * <p>
     * This method is usually used before creating a new shared list entry,
     * to prevent duplicate sharing with the same user.
     * </p>
     *
     * @param listId ID of the shopping list
     * @param userId ID of the user
     * @return true if the list is already shared with the user, false otherwise
     */
    boolean existsByListIdAndUserId(Long listId, Long userId);

}
