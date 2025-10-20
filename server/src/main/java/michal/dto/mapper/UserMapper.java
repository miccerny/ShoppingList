package michal.dto.mapper;

import michal.dto.UserDTO;
import michal.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

/**
 * Mapper for converting between {@link UserEntity} and {@link UserDTO}.
 * <p>
 * Used by services to transform user data between database and API layers.
 */
@Mapper(componentModel = "spring")
public interface UserMapper {

    /** Converts a UserDTO to a UserEntity. */
    UserEntity toEntity(UserDTO source);

    /** Converts a UserEntity to a UserDTO (password is ignored for security reasons). */
    @Mapping(target = "password", ignore = true)
    UserDTO toDTO(UserEntity source);
}
