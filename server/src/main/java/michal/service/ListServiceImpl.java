package michal.service;

import michal.dto.ListDTO;
import michal.dto.mapper.ListMapper;
import michal.entity.ListEntity;
import michal.entity.UserEntity;
import michal.entity.repository.ListRepository;
import michal.entity.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ListServiceImpl implements ListService{

    @Autowired
    private ListRepository listRepository;

    @Autowired
    private ListMapper listMapper;

    @Autowired
    private UserRepository userRepository;

    @Override
    public ListDTO addList(ListDTO listDTO){
        ListEntity listEntity = listMapper.toEntity(listDTO);
        listEntity.setOwner(listEntity.getOwner());
        ListEntity save = listRepository.save(listEntity);

        return listMapper.toDTO(save);
    }

    @Override
    public ListDTO getListWithItems(Long id) {
        list(id);
        return listMapper.toDTO(list(id));
    }

    @Override
    public List<ListDTO> getAll() {
        return listRepository.findAll().stream()
                .map(listMapper::toDTO)
                .toList();

    }

    @Override
    public ListDTO updateList(ListDTO listDTO) {
        ListEntity exist = list(listDTO.getId());
        exist.setName(listDTO.getName());
        ListEntity updated = listRepository.save(exist);
        return listMapper.toDTO(updated);
    }

    @Override
    public void removeList(long id) {
        ListEntity exist = list(id);
        listRepository.delete(exist);
    }

    private ListEntity list (long id){
        return  listRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("List " + id + " nenalezen"));
    }
}
