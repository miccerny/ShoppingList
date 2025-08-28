package michal.dto.mapper;

import michal.dto.UserDTO;
import michal.entity.UserEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {

    UserEntity toEntity(UserDTO source);
    UserDTO toDTO(UserEntity source);
}
