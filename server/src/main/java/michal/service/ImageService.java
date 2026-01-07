package michal.service;

import michal.entity.UserEntity;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

public interface ImageService {

    Resource loadImage(Long imageId, UserEntity user);
    String getImageContentType(Long imageId, UserEntity user);
    void updateItemImage(Long itemId, MultipartFile file, UserEntity user);
    void deleteItemImage(Long itemId, UserEntity user);
}
