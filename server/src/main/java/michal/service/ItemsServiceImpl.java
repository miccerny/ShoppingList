package michal.service;

import michal.dto.ItemsDTO;
import michal.dto.mapper.ItemsMapper;
import michal.entity.ItemsEntity;
import michal.entity.ListEntity;
import michal.entity.repository.ItemsRepository;
import michal.entity.repository.ListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
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

    /**
     * Adds a new item to a specific list.
     *
     * @param listId   ID of the list
     * @param itemsDTO item data
     * @return created item
     */
    @Override
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
    public ItemsDTO updateItems(Long id, ItemsDTO itemsDTO) {
        ItemsEntity items = item(id);
        items.setName(itemsDTO.getName());
        items.setCount(itemsDTO.getCount());
        items.setPurchased(itemsDTO.isPurchased());

        ItemsEntity updated = itemsRepository.save(items);
        return itemsMapper.toDTO(updated);
    }

    @Override
    public void importItems(Long listId, List<ItemsDTO> items){
        if(items == null) return;

        for(ItemsDTO dto: items){
            ItemsEntity itemsEntity = itemsMapper.toEntity(dto);
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
    public void removeItem(long id) {
        ItemsEntity itemsEntity = item(id);
        itemsRepository.delete(itemsEntity);
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
