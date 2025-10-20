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
}
