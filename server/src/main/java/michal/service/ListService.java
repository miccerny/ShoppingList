package michal.service;

import michal.dto.ListDTO;

import java.util.List;

public interface ListService{

    ListDTO addList(ListDTO listDTO);

    List<ListDTO> getAll();

    ListDTO updateList(ListDTO listDTO);

    void removeList(long id);

    ListDTO getListWithItems(Long id);
}
