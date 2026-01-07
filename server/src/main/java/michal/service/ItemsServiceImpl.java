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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * Service implementation for managing shopping list items.
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
     * @param listId   ID of the list
     * @param itemsDTO item data
     * @return created item
     */
    @Override
    @Transactional
    public ItemsDTO addItems(Long listId, ItemsDTO itemsDTO) {
        if (listId == null) {
            throw new IllegalArgumentException("List ID nesmí být null");
        }

        // Map DTO to entity and set list reference
        ItemsEntity items = itemsMapper.toEntity(itemsDTO);

        // Save entity to database
        ItemsEntity saved = itemsRepository.save(items);

        // Return mapped DTO
        return itemsMapper.toDTO(saved);
    }

    /**
     * Returns a single item by ID.
     *
     * @param id item ID
     * @return found item
     */
    @Override
    @Transactional(readOnly = true)
    public ItemsDTO getItem(Long id) {
        return itemsMapper.toDTO(item(id));
    }

    /**
     * Returns all items belonging to a specific list.
     *
     * @param listId ID of the list
     * @return list of items
     */
    @Override
    @Transactional(readOnly = true)
    public List<ItemsDTO> getAllItems(Long listId) {
        return itemsRepository.findByListId(listId).stream()
                .map(itemsMapper::toDTO)
                .toList();
    }

    /**
     * Updates an existing item.
     *
     * @param itemsDTO updated item data
     * @return updated item
     */
    @Override
    @Transactional
    public ItemsDTO updateItems(Long id, ItemsDTO itemsDTO, MultipartFile multipartFile, UserEntity user) {
        ItemsEntity items = itemsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("ITEM_NOT_FOUND"));

        // tady si klidně nech ownership pro editaci itemu
        if (!items.getList().getOwner().getId().equals(user.getId())) {
            throw new ForbiddenException("ITEM_NOT_OWNED");
        }

        if (itemsDTO != null) {
            items.setName(itemsDTO.getName());
            items.setCount(itemsDTO.getCount());
            items.setPurchased(itemsDTO.isPurchased());
        }

        ItemsEntity saved = itemsRepository.save(items);
        
        if(multipartFile != null &&!multipartFile.isEmpty()) {
            imageService.updateItemImage(saved.getId(), multipartFile, user);
        }

        return itemsMapper.toDTO(itemsRepository.findById(id).orElseThrow());
    }

    @Override
    @Transactional
    public void importItems(Long listId, List<ItemsDTO> items) {
        if (items == null) return;

        ListEntity listRef = listRepository.getReferenceById(listId);

        for (ItemsDTO dto : items) {
            ItemsEntity itemsEntity = itemsMapper.toEntity(dto);
            itemsEntity.setId(null);                 // import = nové záznamy (doporučeno)
            itemsEntity.setList(listRef);
            itemsEntity.setPurchased(dto.isPurchased());
            itemsRepository.save(itemsEntity);
        }
    }

    /**
     * Deletes an item by ID.
     *
     * @param id item ID
     */
    @Override
    @Transactional
    public void removeItem(long id, UserEntity user) {

        imageService.deleteItemImage((long) id, user );
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
}
