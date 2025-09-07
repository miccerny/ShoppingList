package michal.service;

import michal.dto.ItemsDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GuestItemsServiceImpl implements GuestItemsService{

    private final Map<String, Map<Long, List<ItemsDTO>>> guestItems = new HashMap<>();
    private long itemCounter = 1;

    @Override
    public ItemsDTO addItemForGuest(String sessionId, ItemsDTO dto) {
        dto.setId(itemCounter++);

        guestItems.computeIfAbsent(sessionId, k-> new HashMap<>())
                .computeIfAbsent(dto.getListId(), k-> new ArrayList<>())
                .add(dto);

        return dto;
    }

    @Override
    public List<ItemsDTO> getItemsForList(String sessionId, Long listId) {
        return guestItems
                .getOrDefault(sessionId, Map.of())
                .getOrDefault(listId, List.of());
    }

    @Override
    public void clearGuest(String sessionId) {
        guestItems.remove(sessionId);
    }
}
