package michal.service;

import michal.dto.ListDTO;
import michal.dto.mapper.ListMapper;
import michal.dto.mapper.SharedListMapper;
import michal.entity.ListEntity;
import michal.entity.SharedListEntity;
import michal.entity.UserEntity;
import michal.entity.repository.ItemsRepository;
import michal.entity.repository.ListRepository;
import michal.entity.repository.SharedListRepository;
import michal.entity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * Service implementation for managing shopping lists.
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

    /**
     * Creates a new shopping list and assigns it to the currently logged-in user.
     *
     * @param listDTO list data
     * @return created list
     */
    @Override
    public ListDTO addList(ListDTO listDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new RuntimeException("Uživatel není přihlášen");
        }

        UserEntity user = (UserEntity) auth.getPrincipal();

        // Map DTO to entity and set the owner
        ListEntity listEntity = listMapper.toEntity(listDTO);
        listEntity.setOwner(user);

        ListEntity saved = listRepository.save(listEntity);
        return listMapper.toDTO(saved);
    }

    /**
     * Returns a shopping list with its items.
     *
     * @param id list ID
     * @return list including items
     */
    @Override
    public ListDTO getListWithItems(Long id) {
        return listMapper.toDTO(list(id));
    }


    /**
     * Shares an existing shopping list with another user.
     * <p>
     * The method loads the target list and the user by email,
     * creates a new shared-list entry using the mapper and
     * stores the relationship in the database.
     * </p>
     *
     * @param listId ID of the list that should be shared
     * @param email  email address of the user to share the list with
     * @throws RuntimeException if the list or user does not exist
     */
    @Override
    public void shareList(Long listId, String email){
        // Load the list to be shared; fail if it does not exist
        ListEntity list = listRepository.findById(listId)
                .orElseThrow(() -> new RuntimeException("Seznam nenalezen"));

        // Find the user with whom the list should be shared
        UserEntity userToShare = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Uživatel s emailem" + email + "nenalezen"));

        if(sharedListRepository.existsByListIdAndUserId(listId, userToShare.getId())){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "\"Tento seznam je s tímto uživatelem již sdílen.");
        }

        // Use the mapper to build the SharedListEntity instance
        SharedListEntity sharedList = sharedListMapper.toEntity(list, userToShare);

        // Save the relation so the user gains access to the list
        sharedListRepository.save(sharedList);
    }

    /**
     * Imports guest lists for the logged-in user.
     *
     * @param guestList list of guest lists
     * @return HTTP response with result
     */
    @Override
    public ResponseEntity<Void> importList(List<ListDTO> guestList) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        UserEntity user = (UserEntity) auth.getPrincipal();

        // Reassign guest lists to the logged-in user
        for (ListDTO guest : guestList) {
            ListEntity entity = listMapper.toEntity(guest);
            entity.setId(null);
            entity.setOwner(user);
            listRepository.save(entity);
        }

        return ResponseEntity.ok().build();
    }

    /**
     * Returns all shopping lists owned by the current user.
     *
     * @return list of user's lists
     */
    @Override
    public List<ListDTO> getAllByOwner() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new RuntimeException("Uživatel není přihlášen");
        }

        UserEntity user = (UserEntity) auth.getPrincipal();

        return listRepository.findByOwner_Id(user.getId()).stream()
                .map(entity -> {
                    ListDTO listDTO = listMapper.toDTO(entity);
                    listDTO.setItemsCount(itemsRepository.countByListId(entity.getId()));
                    return listDTO;
                })
                .toList();
    }

    /**
     * Updates an existing list.
     *
     * @param listDTO updated list data
     * @return updated list
     */
    @Override
    public ListDTO updateList(ListDTO listDTO) {
        ListEntity existing = list(listDTO.getId());
        existing.setName(listDTO.getName());

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
