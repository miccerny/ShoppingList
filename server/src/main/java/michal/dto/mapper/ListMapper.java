package michal.dto.mapper;

import michal.dto.ListDTO;
import michal.entity.ListEntity;
import michal.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ListMapper {

    @Mapping(target = "owner.id" , source = "ownerId")
    ListEntity toEntity(ListDTO source);

    @Mapping(target = "ownerId", source = "owner.id")
    ListDTO toDTO(ListEntity source);

    void updateEntity(ListDTO listDTO, @MappingTarget ListEntity listEntity);


}
