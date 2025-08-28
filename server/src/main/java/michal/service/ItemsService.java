package michal.service;

import michal.dto.ItemsDTO;

import java.util.List;

public interface ItemsService {

    ItemsDTO addItems(ItemsDTO itemsDTO);

    List<ItemsDTO> getAllItems();

    ItemsDTO getItem(Long id);

    ItemsDTO updateItems(ItemsDTO itemsDTO);

    void removeItem(long id);
}
