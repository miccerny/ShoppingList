package michal.service;

import michal.dto.ItemsImageDTO;
import michal.entity.ItemsImageEntity;
import michal.entity.UserEntity;
import org.springframework.web.multipart.MultipartFile;

public interface ImageService {

    void replaceItemImage(Long itemId, MultipartFile file, UserEntity user);
}
