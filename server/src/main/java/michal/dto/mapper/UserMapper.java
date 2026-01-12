package michal.dto.mapper;

import michal.dto.UserDTO;
import michal.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * MapStruct mapper for converting between {@link UserEntity} and {@link UserDTO}.
 *
 * <p>
 * This mapper is responsible for exposing only safe and relevant user data
 * to the API layer, while keeping sensitive fields (such as passwords)
 * inside the persistence layer.
 * </p>
 */
@Mapper(componentModel = "spring", uses = {ListMapper.class})
public interface UserMapper {

    /**
     * Converts a {@link UserEntity} into a {@link UserDTO}.
     *
     * <p>
     * Sensitive fields like passwords are intentionally not mapped
     * and therefore never exposed through the API.
     * </p>
     *
     * @param source user entity loaded from the database
     * @return DTO representation of the user
     */
    @Mapping(target = "lists", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    UserEntity toEntity(UserDTO source);

    /**
     * Converts a {@link UserDTO} into a {@link UserEntity}.
     *
     * <p>
     * This mapping is typically used during user registration or updates.
     * Fields that must be generated or managed by the system
     * (such as IDs or encrypted passwords) are handled in the service layer.
     * </p>
     *
     * @param source DTO coming from the API layer
     * @return new user entity instance
     */
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "lists", ignore = true)
    UserDTO toDTO(UserEntity source);
}
