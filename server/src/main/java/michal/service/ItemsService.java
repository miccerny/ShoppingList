package michal.service;

import michal.dto.ItemsDTO;
import java.util.List;

/**
 * Service interface for managing shopping list items.
 */
public interface ItemsService {

    /**
     * Adds a new item to the given list.
     *
     * @param listId   ID of the list
     * @param itemsDTO item data to add
     * @return created item
     */
    ItemsDTO addItems(Long listId, ItemsDTO itemsDTO);

    /**
     * Returns all items belonging to the given list.
     *
     * @param listId ID of the list
     * @return list of items
     */
    List<ItemsDTO> getAllItems(Long listId);

    /**
     * Returns a single item by its ID.
     *
     * @param id item ID
     * @return found item
     */
    ItemsDTO getItem(Long id);

    /**
     * Updates an existing item.
     *
     * @param itemsDTO updated item data
     * @return updated item
     */
    ItemsDTO updateItems(Long id, ItemsDTO itemsDTO);

    void importItems(Long listId, List<ItemsDTO> items);

    /**
     * Removes an item by its ID.
     *
     * @param id item ID
     */
    void removeItem(long id);
}