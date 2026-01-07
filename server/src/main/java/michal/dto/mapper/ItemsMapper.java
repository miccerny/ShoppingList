package michal.dto.mapper;

import michal.dto.ItemsDTO;
import michal.entity.ItemsEntity;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * Mapper for converting between {@link ItemsEntity} and {@link ItemsDTO}.
 * <p>
 * Used by services to map item data between database and API layers.
 */
@Mapper(componentModel = "spring")
public interface ItemsMapper {

    /** Converts an ItemsDTO to an ItemsEntity (maps listId → list.id). */
    @Mapping(target = "list.id", source = "listId")
    ItemsEntity toEntity(ItemsDTO source);

    /** Converts an ItemsEntity to an ItemsDTO (maps list.id → listId). */
    @Mapping(target = "listId", source = "list.id")
    @Mapping(target = "imageId", source = "image.id")
    @Mapping(target = "imageUrl", ignore = true)
    ItemsDTO toDTO(ItemsEntity source);

    @AfterMapping
    default void fillImageUrl(ItemsEntity entity, @MappingTarget ItemsDTO dto) {
        if (entity.getImage() != null && entity.getImage().getId() != null) {
            dto.setImageUrl("/api/images/" + entity.getImage().getId());
        }
    }

}
