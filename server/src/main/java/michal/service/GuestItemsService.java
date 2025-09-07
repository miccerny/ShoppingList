package michal.service;

import michal.dto.ItemsDTO;

import java.util.List;

public interface GuestItemsService {

    ItemsDTO addItemForGuest(String sessionId, ItemsDTO dto);

    List<ItemsDTO> getItemsForList(String sessionId, Long listId);

    void clearGuest(String sessionId);
}
