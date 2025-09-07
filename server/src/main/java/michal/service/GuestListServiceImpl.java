package michal.service;

import michal.dto.ListDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GuestListServiceImpl implements GuestListService{

    private Map<String, Map<Long, ListDTO>> guestLists = new HashMap<>();
    private long listCounter = 1;

    @Override
    public ListDTO addListForGuest(String sessionId, ListDTO dto) {
        dto.setId(listCounter++);
        guestLists.computeIfAbsent(sessionId, k-> new HashMap<>())
                .put(dto.getId(), dto);
        return dto;
    }

    @Override
    public List<ListDTO> getListforGuest(String sessionId) {
        return new ArrayList<>(guestLists.getOrDefault(sessionId, Map.of()).values());
    }

    @Override
    public void clearGuest(String sessionId) {
        guestLists.remove(sessionId);
    }
}
