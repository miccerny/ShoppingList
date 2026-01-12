package michal.dto.mapper;

import michal.dto.ItemsDTO;
import michal.entity.ItemsEntity;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between {@link ItemsEntity} and {@link ItemsDTO}.
 *
 * <p>
 * This mapper is used to keep API DTOs independent from JPA entities by flattening relations
 * such as {@code list.id <-> listId}. It also enriches the DTO with a computed image URL.
 * </p>
 */
@Mapper(componentModel = "spring")
public interface ItemsMapper {

    /**
     * Converts an {@link ItemsDTO} into an {@link ItemsEntity}.
     *
     * <p>
     * The DTO contains {@code listId}, while the entity contains a {@code list} relationship.
     * This mapping sets {@code entity.list.id} based on {@code dto.listId}.
     * </p>
     *
     * @param source DTO coming from the API layer
     * @return entity instance to be persisted
     */
    @Mapping(target = "list.id", source = "listId")
    ItemsEntity toEntity(ItemsDTO source);

    /**
     * Converts an {@link ItemsEntity} into an {@link ItemsDTO}.
     *
     * <p>
     * Flattens JPA relations:
     * <ul>
     *   <li>{@code entity.list.id -> dto.listId}</li>
     *   <li>{@code entity.image.id -> dto.imageId}</li>
     * </ul>
     *
     * The {@code imageUrl} is intentionally ignored here and filled later in {@link #fillImageUrl}.
     * </p>
     *
     * @param source entity loaded from the database
     * @return DTO returned by the API
     */
    @Mapping(target = "listId", source = "list.id")
    @Mapping(target = "imageId", source = "image.id")
    @Mapping(target = "imageUrl", ignore = true)
    ItemsDTO toDTO(ItemsEntity source);

    /**
     * Enriches the mapped DTO with a computed image URL.
     *
     * <p>
     * This keeps the URL-building logic close to mapping, so controllers/services
     * don't need to duplicate it.
     * </p>
     *
     * @param entity source entity (used to read image metadata)
     * @param dto DTO target that will be returned to the client
     */
    @AfterMapping
    default void fillImageUrl(ItemsEntity entity, @MappingTarget ItemsDTO dto) {
        if (entity.getImage() != null && entity.getImage().getId() != null) {
            // Relative URL used by the frontend to fetch the image resource.
            dto.setImageUrl("/api/images/" + entity.getImage().getId());
        }
    }

}
