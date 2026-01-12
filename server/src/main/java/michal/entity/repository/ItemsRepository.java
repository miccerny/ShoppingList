package michal.entity.repository;

import michal.entity.ItemsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

/**
 * Repository interface for {@link ItemsEntity}.
 *
 * <p>
 * This interface is responsible for database access related to items.
 * It extends {@link JpaRepository}, which provides basic CRUD operations
 * without writing SQL manually.
 * </p>
 */
public interface ItemsRepository extends JpaRepository<ItemsEntity, Long> {

    /**
     * Finds all items that belong to a specific list.
     *
     * <p>
     * Spring Data JPA automatically generates the query based on the method name.
     * No custom query is required here.
     * </p>
     *
     * @param listId ID of the shopping list
     * @return list of items for the given list ID
     */
    List<ItemsEntity> findByListId(Long listId);

    /**
     * Returns the total number of items in a given list.
     *
     * @param id the list ID
     * @return number of items
     */
    long countByListId(Long id);

    /**
     * Finds an item only if it belongs to a list owned by the given user.
     *
     * <p>
     *
     * <ul>
     *   <li>the item exists</li>
     *   <li>the item belongs to the specified list</li>
     *   <li>the list belongs to the authenticated user</li>
     * </ul>
     * </p>
     *
     * @param itemId ID of the item
     * @param listId ID of the list
     * @param userId ID of the authenticated user
     * @return Optional containing the item if access is allowed, otherwise empty
     */
    Optional<ItemsEntity> findByIdAndList_IdAndList_Owner_Id(Long itemId, Long listId, Long userId);
}