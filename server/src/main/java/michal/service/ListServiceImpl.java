package michal.service;

import michal.dto.ListDTO;
import michal.dto.mapper.ListMapper;
import michal.entity.ListEntity;
import michal.entity.UserEntity;
import michal.entity.repository.ItemsRepository;
import michal.entity.repository.ListRepository;
import michal.entity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

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
