package michal.controller;

import michal.dto.ItemsDTO;
import michal.service.ItemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.web.bind.annotation.*;

/**
 * This controller handles all HTTP requests related to items inside a shopping list.
 * <p>
 * Each list has its own ID, and we use it in the URL path (for example: /api/list/1/items).
 * <p>
 * The controller talks to the ItemsService to get, add, update, or delete items.
 */
@RestController
@RequestMapping("/api/list/{listId}")
public class ItemsController {

    // The service that contains business logic for managing items
    @Autowired
    private ItemsService itemsService;

    /**
     * Get all items that belong to a specific list.
     * Example request: GET /api/list/1/items
     *
     * @param listId the ID of the list
     * @return a list of all items for the given list
     */
    @GetMapping("/items")
    public List<ItemsDTO> getAllItems(@PathVariable Long listId) {
        // Calls the service to get all items from a list
        return itemsService.getAllItems(listId);
    }

    /**
     * Add a new item to a specific list.
     * Example request: POST /api/list/1/items
     * The item data comes in the request body as JSON.
     *
     * @param listId   the ID of the list where the item will be added
     * @param itemsDTO the item data sent from the frontend
     * @return the created item as DTO
     */
    @PostMapping("/items")
    public ItemsDTO addItems(@PathVariable Long listId, @RequestBody ItemsDTO itemsDTO) {
        // Calls the service to add a new item to a list
        return itemsService.addItems(listId, itemsDTO);
    }

    /**
     * Update an existing item.
     * Example request: PUT /api/list/1/items/5
     * The item with ID 5 will be updated with new data.
     *
     * @param itemsDTO the updated item data from the frontend
     * @return the updated item as DTO
     */
    @PutMapping("/items/{id}")
    public ItemsDTO update(@RequestBody ItemsDTO itemsDTO) {
        // Calls the service to update the item
        return itemsService.updateItems(itemsDTO);
    }

    /**
     * Delete an item by its ID.
     * Example request: DELETE /api/list/1/items/5
     *
     * @param id the ID of the item to delete
     */
    @DeleteMapping("/items/{id}")
    public void remove(@PathVariable long id) {
        // Calls the service to remove the item by ID
        itemsService.removeItem(id);
    }
}
