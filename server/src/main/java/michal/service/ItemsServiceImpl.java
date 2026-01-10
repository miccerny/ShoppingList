package michal.service;

import michal.dto.ItemsDTO;
import michal.dto.mapper.ItemsMapper;
import michal.entity.ItemsEntity;
import michal.entity.ListEntity;
import michal.entity.UserEntity;
import michal.entity.repository.ItemsRepository;
import michal.entity.repository.ListRepository;
import michal.service.Exception.ForbiddenException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Service implementation for managing shopping list items.
 *
 * <p>
 * This class contains business logic for item CRUD operations and
 * enforces access control (ownership checks) for protected actions.
 * </p>
 */
@Service
public class ItemsServiceImpl implements ItemsService {

    @Autowired
    private ItemsRepository itemsRepository;

    @Autowired
    private ItemsMapper itemsMapper;

    @Autowired
    private ListRepository listRepository;

    @Autowired
    private ImageService imageService;

    /**
     * Adds a new item to a specific list.
     *
     * <p>
     * The method maps the DTO to an entity and saves it into the database.
     * </p>
     *
     * @param listId   ID of the list
     * @param itemsDTO item data
     * @return created item
     */
    @Override
    @Transactional
    public ItemsDTO addItems(Long listId, ItemsDTO itemsDTO) {
        // Basic input validation: listId must be provided.
        if (listId == null) {
            throw new IllegalArgumentException("List ID nesmí být null");
        }

        // Map DTO to entity (the mapper is responsible for field conversion).
        ItemsEntity items = itemsMapper.toEntity(itemsDTO);

        // Save entity to database
        ItemsEntity saved = itemsRepository.save(items);

        // Debug log (useful during development).
        System.out.println("Item with ID " + saved.getId() + " and name " + saved.getName() + " was saved.");
        // Return mapped DTO (API layer uses DTOs, not entities).
        return itemsMapper.toDTO(saved);
    }

    /**
     * Returns a single item by ID.
     *
     * <p>
     * This method enforces access control by querying only items that belong
     * to the specified list and are owned by the authenticated user.
     * </p>
     *
     * @param id item ID
     * @param listId list ID (used for access validation)
     * @param user authenticated user
     * @return found item
     */
    @Override
    @Transactional(readOnly = true)
    public ItemsDTO getItem(Long id, Long listId, UserEntity user) {
        // Load item only if it belongs to the list and the list owner matches the current user.
        ItemsEntity item = itemsRepository
                .findByIdAndList_IdAndList_Owner_Id(id, listId, user.getId())
                .orElseThrow(() -> new org.springframework.security.access.AccessDeniedException("No access"));
        return itemsMapper.toDTO(item);
    }

    /**
     * Returns all items belonging to a specific list.
     *
     * <p>
     * This method first checks whether the user owns the list.
     * If not, it throws an access denied exception.
     * </p>
     *
     * @param listId ID of the list
     * @param user authenticated user
     * @return list of items
     */
    @Override
    @Transactional(readOnly = true)
    public List<ItemsDTO> getAllItems(Long listId, UserEntity user) {

        // Quick access check for the list.
        if (!listRepository.existsByIdAndOwnerId(listId, user.getId())) {
            throw new AccessDeniedException("No access to this list");
        }
        // Load items and convert entities to DTOs.
        return itemsRepository.findByListId(listId).stream()
                .map(itemsMapper::toDTO)
                .toList();
    }

    /**
     * Updates an existing item.
     *
     * <p>
     * The update is allowed only for the list owner (ownership check is enforced).
     * The method updates fields from DTO and saves changes to the database.
     * </p>
     *
     * @param id item ID
     * @param itemsDTO updated item data
     * @param user authenticated user
     * @return updated item
     */
    @Override
    @Transactional
    public ItemsDTO updateItem(Long id, ItemsDTO itemsDTO, UserEntity user) {
        // Load item and verify ownership.
        ItemsEntity item = getOwnedItem(id, user);

        // Update entity fields from DTO (if DTO is provided).
        if (itemsDTO != null) {
            item.setName(itemsDTO.getName());
            item.setCount(itemsDTO.getCount());
            item.setPurchased(itemsDTO.isPurchased());
        }
        // Persist changes.
        ItemsEntity saved = itemsRepository.save(item);

        return itemsMapper.toDTO(saved);
    }

    /**
     * Updates (uploads/replaces) an item image.
     *
     * <p>
     * This method checks ownership, then delegates the actual file processing
     * to {@link ImageService}. After the image is updated, it reloads the item
     * and returns the latest DTO representation.
     * </p>
     *
     * @param id item ID
     * @param file uploaded image file
     * @param user authenticated user
     * @return updated item DTO
     */
    @Override
    public ItemsDTO updateItemImage(Long id, MultipartFile file, UserEntity user){
        // Ensure that only the owner can update the image.
        ItemsEntity item = getOwnedItem(id, user);

        // If no file was provided, return the current item state (no change).
        if (file == null || file.isEmpty()) {
            // you can either return current state, or throw 400
            return itemsMapper.toDTO(item);
        }

        // Delegate to ImageService: handles validation, storage and DB updates.
        imageService.updateItemImage(item.getId(), file, user);

        // Reload the item to ensure we return the most up-to-date state.
        ItemsEntity refreshed = itemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ITEM_NOT_FOUND"));

        return itemsMapper.toDTO(refreshed);
    }

    /**
     * Imports a list of items into a given list.
     *
     * <p>
     * This method performs a bulk insert. Each imported DTO is converted to an entity,
     * connected to the list reference, and saved.
     * </p>
     *
     * @param listId ID of the list
     * @param items items to import
     */
    @Override
    @Transactional
    public void importItems(Long listId, List<ItemsDTO> items) {
        // Nothing to import.
        if (items == null) return;

        // Get a reference to the list without fully loading it (lazy reference).
        ListEntity listRef = listRepository.getReferenceById(listId);

        for (ItemsDTO dto : items) {
            // Convert each DTO to entity.
            ItemsEntity itemsEntity = itemsMapper.toEntity(dto);
            // Ensure import creates new records (id must be null).
            itemsEntity.setId(null);                 // import = nové záznamy (doporučeno)
            // Assign list and additional fields.
            itemsEntity.setList(listRef);
            itemsEntity.setPurchased(dto.isPurchased());
            // Persist each imported item.
            itemsRepository.save(itemsEntity);
        }
    }

    /**
     * Deletes an item by ID.
     *
     * <p>
     * This method also deletes an associated image (if present),
     * and then removes the item record from the database.
     * </p>
     *
     * @param id item ID
     * @param user authenticated user
     */
    @Override
    @Transactional
    public void removeItem(long id, UserEntity user) {
        // Delete image first (if exists and allowed).
        imageService.deleteItemImage((long) id, user );
        // Delete the item entity itself.
        itemsRepository.delete(item(id));
    }

    /**
     * Helper method to find an item or throw an exception if not found.
     *
     * @param id item ID
     * @return found {@link ItemsEntity}
     */
    private ItemsEntity item(long id) {
        return itemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Položka s ID " + id + " nenalezena"));
    }

    /**
     * Loads an item and verifies that the current user owns the list.
     *
     * <p>
     * This method is used to protect operations that must be performed
     * only by the list owner (update/delete/image upload).
     * </p>
     *
     * @param itemId item ID
     * @param user authenticated user
     * @return owned item entity
     */
    private ItemsEntity getOwnedItem(Long itemId, UserEntity user) {
        // Load item from DB.
        ItemsEntity item = itemsRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("ITEM_NOT_FOUND"));

        // Defensive null checks (avoid NullPointerException).
        if (user == null || item.getList() == null || item.getList().getOwner() == null) {
            throw new ForbiddenException("ITEM_NOT_OWNED");
        }

        // Ownership verification: only list owner is allowed.
        if (!item.getList().getOwner().getId().equals(user.getId())) {
            throw new ForbiddenException("ITEM_NOT_OWNED");
        }

        return item;
    }
}
