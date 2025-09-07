package michal.service;

import michal.dto.ListDTO;

import java.util.List;

public interface GuestListService {

    ListDTO addListForGuest(String sessionId, ListDTO dto);

    List<ListDTO> getListforGuest(String sessionId);

    void clearGuest(String sessionId);


}
