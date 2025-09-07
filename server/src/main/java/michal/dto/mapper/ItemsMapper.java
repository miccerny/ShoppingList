package michal.dto.mapper;

import michal.dto.ItemsDTO;
import michal.entity.ItemsEntity;
import michal.entity.ListEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ItemsMapper {

    @Mapping(target = "list.id", source = "listId")
    ItemsEntity toEntity(ItemsDTO source);

    @Mapping(target = "listId", source = "list.id")
    ItemsDTO toDTO(ItemsEntity source);
}
