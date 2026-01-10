package michal.dto.mapper;

import michal.dto.ListDTO;
import michal.entity.ListEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * MapStruct mapper for converting between {@link ListEntity} and {@link ListDTO}.
 *
 * <p>
 * This mapper is used by the service layer to separate persistence entities
 * from API-facing DTOs. It also intentionally ignores collection fields that
 * should be managed explicitly in business logic.
 * </p>
 */
@Mapper(componentModel = "spring")
public interface ListMapper {

    /**
     * Converts a {@link ListDTO} into a new {@link ListEntity}.
     *
     * <p>
     * Collection fields such as {@code items} and {@code sharedWith} are ignored
     * because they are managed separately and should not be overwritten during mapping.
     * </p>
     *
     * @param source DTO coming from the API layer
     * @return new entity instance
     */
    @Mapping(target = "owner.id", source = "ownerId")
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "sharedWith", ignore = true)
    ListEntity toEntity(ListDTO source);

    /**
     * Converts a {@link ListEntity} into a {@link ListDTO}.
     *
     * <p>
     * Flattens the owner relationship by mapping {@code owner.id} to {@code ownerId}.
     * The number of items is ignored here and can be calculated separately.
     * </p>
     *
     * @param source entity loaded from the database
     * @return DTO representation of the list
     */
    @Mapping(target = "ownerId", source = "owner.id")
    @Mapping(target = "itemsCount", ignore = true)
    ListDTO toDTO(ListEntity source);

    /**
     * Updates an existing {@link ListEntity} with values from {@link ListDTO}.
     *
     * <p>
     * This method is typically used when updating an existing list.
     * Collection fields and relationships are ignored to avoid accidental
     * data loss or unintended modifications.
     * </p>
     *
     * @param listDTO DTO containing updated values
     * @param listEntity existing entity to be updated
     */
    @Mapping(target = "owner.id", source = "ownerId")
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "sharedWith", ignore = true)
    void updateEntity(ListDTO listDTO, @MappingTarget ListEntity listEntity);
}