package michal.service;

import michal.dto.ListDTO;
import michal.dto.mapper.ListMapper;
import michal.dto.mapper.SharedListMapper;
import michal.entity.ListEntity;
import michal.entity.SharedListEntity;
import michal.entity.UserEntity;
import michal.entity.enumy.ValidationErrorCode;
import michal.entity.repository.ItemsRepository;
import michal.entity.repository.ListRepository;
import michal.entity.repository.SharedListRepository;
import michal.entity.repository.UserRepository;
import michal.service.Exception.UserNotLoggedException;
import michal.service.Exception.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Service implementation for managing shopping lists.
 *
 * <p>
 * This class contains business logic for list operations:
 * create, read, update, delete, import and share lists.
 * It also uses the current authentication context to identify the logged-in user.
 * </p>
 */
@Service
public class ListServiceImpl implements ListService {

    @Autowired
    private ListRepository listRepository;

    @Autowired
    private ListMapper listMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemsRepository itemsRepository;

    @Autowired
    private SharedListMapper sharedListMapper;

    @Autowired
    private SharedListRepository sharedListRepository;

    @Autowired
    private ItemsService itemsService;

    /**
     * Creates a new shopping list and assigns it to the currently logged-in user.
     *
     * <p>
     * The method reads the authentication from {@link SecurityContextHolder}.
     * If the request is not authenticated, it throws {@link UserNotLoggedException}.
     * </p>
     *
     * @param listDTO list data
     * @return created list
     */
    @Override
    @Transactional
    public ListDTO addList(ListDTO listDTO) {
        // Read authentication information for the current request/thread.
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Basic authentication check (prevent anonymous access).
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new UserNotLoggedException("Uživatel není přihlášen");
        }

        // Principal is expected to be UserEntity in this application.
        UserEntity user = (UserEntity) auth.getPrincipal();

        // Convert incoming DTO to JPA entity and assign the owner.
        ListEntity listEntity = listMapper.toEntity(listDTO);
        listEntity.setOwner(user);

        // Simple validation: list name must not be empty.
        if(listEntity.getName().isEmpty()){
            throw new ValidationException(ValidationErrorCode.LIST_NAME_EMPTY);
        }
        // Persist the list.
        ListEntity saved = listRepository.save(listEntity);

        // Debug log (useful during development).
        System.out.println("List: " + saved.getName() + ", ID " + saved.getId() + " was saved");
        // Return DTO back to controller layer.
        return listMapper.toDTO(saved);
    }

    /**
     * Returns a shopping list with its items.
     *
     * <p>
     * This method loads the list entity and maps it to {@link ListDTO}.
     * The actual loading of items depends on the JPA relationship settings
     * (lazy/eager) and the mapper implementation.
     * </p>
     *
     * @param id list ID
     * @return list including items
     */
    @Override
    @Transactional(readOnly = true)
    public ListDTO getListWithItems(Long id) {
        // Debug log for tracking list requests.
        System.out.println("List with ID " + id + " was loaded");
        return listMapper.toDTO(list(id));
    }


    /**
     * Shares an existing shopping list with another user.
     *
     * <p>
     * The method loads the target list and the user by email,
     * creates a new shared-list entry using the mapper and
     * stores the relationship in the database.
     * </p>
     *
     * <p>
     * It also prevents duplicate sharing by checking if a relation
     * already exists for the same list and user.
     * </p>
     *
     * @param listId ID of the list that should be shared
     * @param email  email address of the user to share the list with
     * @throws RuntimeException if the list or user does not exist
     */
    @Override
    @Transactional
    public void shareList(Long listId, String email){
        // Load the list to be shared; fail if it does not exist.
        ListEntity list = listRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("Seznam nenalezen"));

        // Find the user with whom the list should be shared.
        UserEntity userToShare = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Uživatel s emailem" + email + "nenalezen"));

        // Prevent creating duplicate sharing records.
        if(sharedListRepository.existsByListIdAndUserId(listId, userToShare.getId())){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "\"Tento seznam je s tímto uživatelem již sdílen.");
        }

        // Use the mapper to build the SharedListEntity instance (list + target user).
        SharedListEntity sharedList = sharedListMapper.toEntity(list, userToShare);

        // Save the relation so the user gains access to the list.
        sharedListRepository.save(sharedList);

        // Debug log (useful during development).
        System.out.println("List with ID " + sharedList.getId() + " was shared to user with email " + email);
    }

    /**
     * Imports guest lists for the logged-in user.
     *
     * <p>
     * This method is typically used when the frontend has "guest" data
     * (e.g. lists stored in browser localStorage) and the user wants to
     * import them into the database after login/registration.
     * </p>
     *
     * @param guestList list of guest lists
     * @return HTTP response with result
     */
    @Override
    @Transactional
    public ResponseEntity<Void> importList(List<ListDTO> guestList) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // If user is not authenticated, return 401 response.
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserEntity user = (UserEntity) auth.getPrincipal();

        // Reassign guest lists to the logged-in user and persist them.
        for (ListDTO guest : guestList) {
            ListEntity entity = listMapper.toEntity(guest);

            // Ensure a new DB record is created.
            entity.setId(null);

            // Assign current user as owner.
            entity.setOwner(user);
            ListEntity saved = listRepository.save(entity);

            // If the imported list contains items, import them as well.
            if(guest.getItems() !=null && !guest.getItems().isEmpty()){
                itemsService.importItems(saved.getId(), guest.getItems());
            }
        }
        // Debug log (useful during development).
        System.out.println("List " + guestList + " was imported form web browser to database");
        return ResponseEntity.ok().build();
    }

    /**
     * Returns all shopping lists accessible for the current user.
     *
     * <p>
     * The repository method can return lists that the user owns and/or lists shared with the user,
     * depending on the query implementation.
     * </p>
     *
     * @return list of accessible lists
     */
    @Override
    @Transactional
    public List<ListDTO> getAllByOwner() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        // Require authentication.
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new RuntimeException("Uživatel není přihlášen");
        }

        UserEntity user = (UserEntity) auth.getPrincipal();

        // Load lists accessible for user and enrich DTO with items count.
        return listRepository.findAllUserAccessibleLists(user.getId()).stream()
                .map(entity -> {
                    ListDTO listDTO = listMapper.toDTO(entity);
                    // Count items for each list (used for UI display).
                    listDTO.setItemsCount(itemsRepository.countByListId(entity.getId()));
                    // Debug log (useful during development).
                    System.out.println("List by user " + user.getEmail() + ": " + listDTO.getName() + ", Number of items in list: " + listDTO.getItemsCount());
                    return listDTO;
                })
                .toList();
    }

    /**
     * Updates an existing list.
     *
     * <p>
     * This method loads the list, updates its name and saves changes.
     * </p>
     *
     * @param listDTO updated list data
     * @return updated list
     */
    @Override
    public ListDTO updateList(ListDTO listDTO) {
        ListEntity existing = list(listDTO.getId());

        // Update list fields.
        existing.setName(listDTO.getName());

        // Persist changes.
        ListEntity updated = listRepository.save(existing);
        return listMapper.toDTO(updated);
    }

    /**
     * Deletes a list by its ID.
     *
     * @param id list ID
     */
    @Override
    public void removeList(long id) {
        ListEntity existing = list(id);
        listRepository.delete(existing);

        // Debug log (useful during development).
        System.out.println("List with ID number" + existing.getId() + " and name " + existing.getName() + " was removed");
    }

    /**
     * Helper method to find a list or throw an exception if not found.
     *
     * @param id list ID
     * @return found {@link ListEntity}
     */
    private ListEntity list(long id) {
        return listRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("List " + id + " nenalezen"));
    }
}
