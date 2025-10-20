package michal.entity.repository;

import michal.entity.ItemsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Repository for accessing item data from the database.
 * Provides methods to find and count items by list ID.
 */
public interface ItemsRepository extends JpaRepository<ItemsEntity, Long> {

    /**
     * Returns all items belonging to a given list.
     *
     * @param listId the ID of the list
     * @return list of items
     */
    List<ItemsEntity> findByListId(Long listId);

    /**
     * Returns the total number of items in a given list.
     *
     * @param id the list ID
     * @return number of items
     */
    long countByListId(Long id);
}