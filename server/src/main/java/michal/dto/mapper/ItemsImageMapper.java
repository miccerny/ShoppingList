package michal.dto.mapper;

import michal.dto.ItemsImageDTO;
import michal.entity.ItemsImageEntity;
import michal.entity.enumy.ImageType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.web.multipart.MultipartFile;

@Mapper(componentModel = "spring")
public interface ItemsImageMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "storedName", ignore = true)
    @Mapping(target = "item", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "size", source = "file.size")
    @Mapping(target = "originalName", source = "file.originalFilename")
    @Mapping(target = "contentType", source = "imageType")
    ItemsImageEntity fromUpload(MultipartFile file, ImageType imageType);

    @Mapping(target = "itemsId", source = "item.id")
    ItemsImageDTO toDTO(ItemsImageEntity source);
}
