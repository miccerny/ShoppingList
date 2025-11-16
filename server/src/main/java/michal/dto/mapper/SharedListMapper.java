package michal.dto.mapper;

import michal.dto.SharedListDTO;
import michal.entity.ListEntity;
import michal.entity.SharedListEntity;
import michal.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SharedListMapper {

    /**
     * Maps existing ListEntity and UserEntity into a new SharedListEntity.
     * Used when creating a new shared record.
     */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "list", source = "list")
    @Mapping(target = "user", source = "user")
    SharedListEntity toEntity(ListEntity list, UserEntity user);

    /**
     * Maps SharedListEntity into a DTO for frontend usage.
     * Includes user email, userId and listId.
     */
    @Mapping(target = "email", source = "user.email")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "listId", source = "list.id")
    SharedListDTO toDTO(SharedListEntity entity);
}
