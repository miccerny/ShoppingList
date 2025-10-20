package michal.dto.mapper;

import michal.dto.ListDTO;
import michal.entity.ListEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * Mapper for converting between {@link ListEntity} and {@link ListDTO}.
 * <p>
 * Used by services to map list data between database and API layers.
 */
@Mapper(componentModel = "spring")
public interface ListMapper {

    /** Converts a ListDTO to a ListEntity (maps ownerId → owner.id). */
    @Mapping(target = "owner.id", source = "ownerId")
    ListEntity toEntity(ListDTO source);

    /** Converts a ListEntity to a ListDTO (maps owner.id → ownerId). */
    @Mapping(target = "ownerId", source = "owner.id")
    ListDTO toDTO(ListEntity source);

    /** Updates an existing ListEntity with values from ListDTO. */
    void updateEntity(ListDTO listDTO, @MappingTarget ListEntity listEntity);
}