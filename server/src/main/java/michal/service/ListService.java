package michal.service;

import michal.dto.ListDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

/**
 * Service interface for managing shopping lists.
 */
public interface ListService {

    /**
     * Creates a new shopping list.
     *
     * @param listDTO list data to add
     * @return created list
     */
    ListDTO addList(ListDTO listDTO);

    /**
     * Imports lists created by a guest user after login.
     *
     * @param guestList list of guest lists
     * @return HTTP response indicating success
     */
    ResponseEntity<Void> importList(List<ListDTO> guestList);

    /**
     * Returns all lists belonging to the current user.
     *
     * @return list of user's lists
     */
    List<ListDTO> getAllByOwner();

    /**
     * Updates an existing shopping list.
     *
     * @param listDTO updated list data
     * @return updated list
     */
    ListDTO updateList(ListDTO listDTO);

    /**
     * Deletes a shopping list by its ID.
     *
     * @param id list ID
     */
    void removeList(long id);

    /**
     * Returns a shopping list with its items.
     *
     * @param id list ID
     * @return list with included items
     */
    ListDTO getListWithItems(Long id);

    /**
     * Shares a shopping list with another user identified by email.
     *
     * <p>
     * This method allows the list owner to grant access to the list
     * to another registered user.
     * </p>
     *
     * <p>
     * The implementation is expected to:
     * <ul>
     *   <li>verify that the list exists</li>
     *   <li>verify that the current user is the list owner</li>
     *   <li>find the target user by email</li>
     *   <li>create a shared list relationship</li>
     * </ul>
     * </p>
     *
     * @param listId ID of the list to be shared
     * @param email email address of the user to share the list with
     */
    void shareList(Long listId, String email);
}
