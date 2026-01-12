package michal.controller;

import michal.dto.ListDTO;
import michal.dto.ShareRequestDTO;
import michal.service.ListService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

/**
 * This controller manages all actions related to shopping lists.
 * <p>
 * It allows the user to create, read, update, delete, and import lists.
 * Each list belongs to the currently logged-in user.
 * <p>
 * The controller communicates with {@link ListService} which contains the main business logic.
 */
@RestController
@RequestMapping("/api/list")
public class ListController {

    // The service that handles the main logic for lists
    @Autowired
    private ListService listService;

    /**
     * Create a new shopping list.
     * Example request: POST /api/list
     *
     * @param listDTO the data of the list sent from the frontend
     * @return the created list as DTO
     */
    @PostMapping
    public ListDTO addList(@RequestBody ListDTO listDTO) {
        // Calls the service to add a new list
        return listService.addList(listDTO);
    }

    /**
     * Get all shopping lists that belong to the currently logged-in user.
     * Example request: GET /api/list
     *
     * @return a list of all lists for the current user
     */
    @GetMapping
    public List<ListDTO> getListsForCurrentUser() {
        // Calls the service to get all lists for the current user
        return listService.getAllByOwner();
    }

    /**
     * Get one specific shopping list with its items.
     * Example request: GET /api/list/5
     *
     * @param listId the ID of the list to get
     * @return the list with its items as DTO
     */
    @GetMapping("/{listId}")
    public ListDTO getList(@PathVariable Long listId) {
        // Calls the service to get a single list with its items
        return listService.getListWithItems(listId);
    }

    /**
     * Update an existing shopping list.
     * Example request: PUT /api/list/5
     *
     * @param listId  the ID of the list to update
     * @param listDTO the new data for the list
     * @return the updated list as DTO
     */
    @PutMapping("/{listId}")
    public ListDTO updateList(@PathVariable Long listId, @RequestBody ListDTO listDTO) {
        // Print incoming data to console for debugging
        System.out.println("Incoming DTO: " + listDTO);

        // Make sure the ID in the DTO matches the one in the path
        listDTO.setId(listId);

        // Calls the service to update the list
        return listService.updateList(listDTO);
    }

    /**
     * Shares the selected shopping list with another user.
     * <p>
     * The frontend sends the target user's email in the request body.
     * The service layer then resolves the user, validates the list and
     * stores the sharing relation in the database.
     * </p>
     *
     * @param listId     ID of the list that should be shared
     * @param requestDTO object containing the email of the user to share the list with
     * @return HTTP 200 response confirming successful sharing
     */
    @PostMapping("/{listId}")
    public ResponseEntity<?> shareList(@PathVariable Long listId,
                                       @RequestBody ShareRequestDTO requestDTO){
        listService.shareList(listId, requestDTO.getEmail());
        return ResponseEntity.ok(Map.of("message", "shared"));
    }

    /**
     * Import lists created by a guest user after they log in.
     * This allows transferring temporary data (like offline lists) to the logged-in account.
     * Example request: POST /api/list/import
     *
     * @param guestLists list of lists created in guest mode
     * @return ResponseEntity with no content (status 200 or 204)
     */
    @PostMapping("/import")
    public ResponseEntity<Void> importLists(@RequestBody List<ListDTO> guestLists) {
        // Calls the service to import guest lists into user's account
        return listService.importList(guestLists);
    }

    /**
     * Delete a specific list by its ID.
     * Example request: DELETE /api/list/5
     *
     * @param listId the ID of the list to delete
     */
    @DeleteMapping("/{listId}")
    public void removeList(@PathVariable Long listId) {
        // Calls the service to remove the list
        listService.removeList(listId);
    }
}
