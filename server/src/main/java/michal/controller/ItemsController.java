package michal.controller;


import michal.dto.ItemsDTO;
import michal.entity.UserEntity;
import michal.service.ItemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;

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
     * Retrieves all items belonging to a specific list.
     *
     * <p>
     * This endpoint returns all items that are part of the given list.
     * Access is restricted to the authenticated user who owns the list
     * or has permission to view it.
     * </p>
     *
     * @param listId ID of the list whose items should be retrieved
     * @param user currently authenticated user
     * @return list of {@link ItemsDTO} objects
     */
    @GetMapping("/items")
    public List<ItemsDTO> getAllItems(@PathVariable Long listId,
                                      @AuthenticationPrincipal UserEntity user) {
        // Delegates item retrieval to the service layer.
        // The service validates user access and loads items from the database.
        return itemsService.getAllItems(listId, user);
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
     * Retrieves a single item from a specific list.
     *
     * <p>
     * This endpoint returns detailed information about an item that belongs
     * to the given list. Access is restricted to the authenticated user.
     * </p>
     *
     * @param id ID of the requested item
     * @param listId ID of the list that owns the item
     * @param user currently authenticated user
     * @return {@link ItemsDTO} representing the requested item
     */
    @GetMapping("/items/{id}")
    public ItemsDTO getItemFromList(
            @PathVariable Long id,
            @PathVariable Long listId,
            @AuthenticationPrincipal UserEntity user
    ) {
        // Delegates item retrieval to the service layer.
        // The service validates ownership and maps the entity to DTO.
        return itemsService.getItem(id, listId, user);
    }

    /**
     * Updates (or replaces) an image assigned to an existing item.
     *
     * <p>
     * This endpoint accepts a multipart/form-data request containing an image file.
     * The image is validated, stored, and then linked to the given item.
     * </p>
     *
     * @param listId ID of the list that owns the item (used for routing and validation)
     * @param id ID of the item whose image should be updated
     * @param file uploaded image file (multipart/form-data)
     * @param user currently authenticated user
     * @return updated {@link ItemsDTO} including image metadata
     * @throws Exception if the image upload or update fails
     */
    @PutMapping(
            value = "/items/{id}/image",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ItemsDTO updateItemImage(
            @PathVariable Long listId,
            @PathVariable Long id,
            @RequestPart("file") MultipartFile file,
            @AuthenticationPrincipal UserEntity user
    ) throws Exception {
        // Delegates the image update logic to the service layer.
        // The service is responsible for validation, authorization,
        // file storage and entity update.
        return itemsService.updateItemImage(id, file, user);
    }

    /**
     * Updates an existing item with new data.
     *
     * <p>
     * This endpoint updates basic item properties such as name, count or status.
     * It does not handle image upload – image updates are managed by a separate endpoint.
     * </p>
     *
     * @param listId ID of the list that owns the item (used for routing and authorization)
     * @param id ID of the item to be updated
     * @param dto data transfer object containing updated item values
     * @param user currently authenticated user
     * @return updated {@link ItemsDTO}
     */
    @PutMapping(
            value = "/items/{id}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ItemsDTO updateItem(
            @PathVariable Long listId,
            @PathVariable Long id,
            @RequestBody ItemsDTO dto,
            @AuthenticationPrincipal UserEntity user
    ) {
        // Delegates update logic to the service layer.
        // The service validates ownership and applies the changes.
        return itemsService.updateItem(id, dto, user);
    }
    /**
     * Deletes an existing item by its identifier.
     *
     * <p>
     * This endpoint removes an item from the system.
     * The operation is restricted to the authenticated user
     * who owns the item or has permission to modify the list.
     * </p>
     *
     * @param id ID of the item to be deleted
     * @param user currently authenticated user
     */
    @DeleteMapping("/items/{id}")
    public void remove(@PathVariable long id, UserEntity user) {
        // Delegates delete logic to the service layer.
        // The service validates ownership and performs the removal.
        itemsService.removeItem(id, user);
    }
}
