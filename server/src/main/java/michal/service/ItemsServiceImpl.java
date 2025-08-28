package michal.service;

import michal.dto.ItemsDTO;
import michal.dto.ListDTO;
import michal.dto.mapper.ItemsMapper;
import michal.entity.ItemsEntity;
import michal.entity.ListEntity;
import michal.entity.repository.ItemsRepository;
import michal.entity.repository.ListRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ItemsServiceImpl implements ItemsService{

    @Autowired
    private ItemsRepository itemsRepository;

    @Autowired
    private ItemsMapper itemsMapper;

    @Autowired
    private ListRepository listRepository;

    @Override
    public ItemsDTO addItems(ItemsDTO itemsDTO){

        ItemsEntity items = itemsMapper.toEntity(itemsDTO);

        items.setList(listRepository.getReferenceById(itemsDTO.getListId()));
        ItemsEntity save = itemsRepository.save(items);

        return itemsMapper.toDTO(save);
    }

    @Override
    public ItemsDTO getItem(Long id) {
        item(id);
        return itemsMapper.toDTO(item(id));
    }

    @Override
    public List<ItemsDTO> getAllItems(){
        return itemsRepository.findAll().stream()
                .map(itemsMapper::toDTO)
                .toList();
    }

    @Override
    public ItemsDTO updateItems(ItemsDTO itemsDTO) {
        ItemsEntity items = item(itemsDTO.getId());
        items.setName(itemsDTO.getName());
        items.setCount(items.getCount());

        ItemsEntity updated = itemsRepository.save(items);
        return itemsMapper.toDTO(updated);
    }

    @Override
    public void removeItem(long id){
        ItemsEntity itemsEntity = item(id);
        itemsRepository.delete(itemsEntity);
    }

    private ItemsEntity item (long id){
        return itemsRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Položka s " + id + " nenalezena"));
    }

}
