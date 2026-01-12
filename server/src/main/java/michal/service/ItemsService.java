package michal.service;

import michal.dto.ItemsDTO;
import michal.entity.UserEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Service interface for managing shopping list items.
 *
 * <p>
 * Defines business operations for creating, reading, updating and deleting items.
 * Most methods receive an authenticated {@link UserEntity} to enforce access control.
 * </p>
 */
public interface ItemsService {

    /**
     * Adds a new item to the given list.
     *
     * <p>
     * The service is expected to validate the input and also ensure that the user
     * is allowed to add items into the target list.
     * </p>
     *
     * @param listId   ID of the list
     * @param itemsDTO item data to add
     * @return created item
     */
    ItemsDTO addItems(Long listId, ItemsDTO itemsDTO);

    /**
     * Returns all items belonging to the given list.
     *
     * <p>
     * The service should verify that the user has access to the list
     * (owner or shared user, depending on the rules).
     * </p>
     *
     * @param listId ID of the list
     * @param user authenticated user requesting the items
     * @return list of items
     */
    List<ItemsDTO> getAllItems(Long listId, UserEntity user);

    /**
     * Returns a single item by its ID (within a specific list).
     *
     * <p>
     * The service should ensure that:
     * <ul>
     *   <li>the item exists</li>
     *   <li>the item belongs to the provided list</li>
     *   <li>the user has permission to access the list/item</li>
     * </ul>
     * </p>
     *
     * @param id item ID
     * @param listId ID of the list
     * @param user authenticated user requesting the item
     * @return found item
     */
    ItemsDTO getItem(Long id, Long listId, UserEntity user);

    /**
     * Updates an existing item.
     *
     * <p>
     * The service should validate the updated fields and check that the user
     * is allowed to modify the item (typically the list owner).
     * </p>
     *
     * @param id item ID
     * @param dto updated item data
     * @param user authenticated user performing the update
     * @return updated item
     */
    ItemsDTO updateItem(Long id, ItemsDTO dto, UserEntity user);

    /**
     * Updates (uploads/replaces) an image for the given item.
     *
     * <p>
     * The service should validate file size and type, and verify that the user
     * is allowed to modify the item.
     * </p>
     *
     * @param id item ID
     * @param file uploaded image file
     * @param user authenticated user performing the operation
     * @return updated item (usually with updated image data)
     */
    ItemsDTO updateItemImage(Long id, MultipartFile file, UserEntity user);

    /**
     * Imports a collection of items into the given list.
     *
     * <p>
     * This method is typically used for bulk operations (e.g. import from JSON/CSV).
     * Validation and access control are still required.
     * </p>
     *
     * @param listId ID of the list
     * @param items items to import
     */
    void importItems(Long listId, List<ItemsDTO> items);

    /**
     * Removes an item by its ID.
     *
     * <p>
     * The service should verify that the user has permission to delete the item.
     * </p>
     *
     * @param id item ID
     * @param user authenticated user performing the delete
     */
    void removeItem(long id, UserEntity user);
}