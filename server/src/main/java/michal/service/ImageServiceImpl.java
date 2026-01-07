package michal.service;

import michal.dto.mapper.ItemsImageMapper;
import michal.entity.ItemsImageEntity;
import michal.entity.ItemsEntity;
import michal.entity.UserEntity;
import michal.entity.enumy.ImageType;
import michal.entity.enumy.ValidationErrorCode;
import michal.entity.repository.ImageRepository;
import michal.entity.repository.ItemsRepository;
import michal.service.Exception.ForbiddenException;
import michal.service.Exception.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.UUID;

@Service
public class ImageServiceImpl implements ImageService{

    @Autowired
    private ItemsRepository itemsRepository;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private StorageService storageService;

    @Autowired
    private ItemsImageMapper itemsImageMapper;

    private static final long MAX_SIZE_BYTES = 5L * 1024 * 1024; // 5MB

    @Override
    @Transactional
    public void updateItemImage(Long itemId, MultipartFile file, UserEntity userEntity) {

        // obrázek je volitelný
        if(file == null || file.isEmpty()){
            return;
        }

        ItemsEntity item = itemsRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("ITEM_NOT_FOUND"));

        // ownership check (list owner)
        if(!item.getList().getOwner().getId().equals(userEntity.getId())){
            throw new ForbiddenException("ITEM_NOT_OWNED");
        }

        // Size validation
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new ValidationException(ValidationErrorCode.IMAGE_TOO_LARGE);
        }

        // content type -> enum
        String contentType = file.getContentType();
        ImageType imageType = ImageType.fromContentType(contentType)
                .orElseThrow(() -> new ValidationException(
                        ValidationErrorCode.IMAGE_TYPE_NOT_ALLOWED
                ));

        // starý obrázek (pro úklid)
        ItemsImageEntity old = item.getImage();  // přizpůsob názvu fieldů
        Long oldId = old != null ? old.getId() : null;
        String oldStoredName = old != null ? old.getStoredName() : null;


        // ulož nový soubor
        String newStoredName = UUID.randomUUID() + imageType.getExtension();
        try (InputStream in = file.getInputStream()) {
            storageService.save(userEntity.getId(), newStoredName, in);
        } catch (IOException e) {
            throw new RuntimeException("IMAGE_SAVE_FAILED", e);
        }

        // vytvoř novou entitu
        ItemsImageEntity newImage = itemsImageMapper.fromUpload(file, imageType);
        newImage.setStoredName(newStoredName);
        newImage.setItem(item);
        newImage.setCreatedAt(LocalDate.now());

        try {
            ItemsImageEntity savedImage = imageRepository.save(newImage);

            // navázat na item (item je managed v transakci)
            item.setImage(savedImage);

            // úklid starého (DB + storage)
            if (oldId != null) {
                imageRepository.deleteById(oldId);
                if (oldStoredName != null) {
                    storageService.deleteStoredFile(userEntity.getId(), oldStoredName);
                }
            }

        } catch (RuntimeException e) {
            // DB spadla, ale soubor už je uložený -> uklid
            storageService.deleteStoredFile(userEntity.getId(), newStoredName);
            throw e;
        }

    }

    @Override
    @Transactional(readOnly = true)
    public Resource loadImage(Long imageId, UserEntity user) {
        ItemsImageEntity image = getOwnedImage(imageId, user);
        return storageService.loadAsResource(
                user.getId(),
                image.getStoredName()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public String getImageContentType(Long imageId, UserEntity user) {
        ItemsImageEntity image = getOwnedImage(imageId, user);
        return image.getContentType().getContentType(); // nebo image.getContentType()
    }

    @Override
    @Transactional
    public void deleteItemImage(Long itemId, UserEntity user) {
        ItemsEntity item = itemsRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("ITEM_NOT_FOUND"));

        if (!item.getList().getOwner().getId().equals(user.getId())) {
            throw new ForbiddenException("ITEM_NOT_OWNED");
        }

        ItemsImageEntity image = item.getImage();
        if (image == null) return;

        String storedName = image.getStoredName();

        // DB: odpoj -> orphanRemoval smaže image z DB
        item.setImage(null);
        itemsRepository.save(item);

        // FILE: smaž soubor
        storageService.deleteStoredFile(user.getId(), storedName);
    }



    private ItemsImageEntity getOwnedImage(Long imageId, UserEntity user) {
        ItemsImageEntity image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("IMAGE_NOT_FOUND"));

        Long ownerId = image.getItem().getList().getOwner().getId();
        if (!ownerId.equals(user.getId())) {
            throw new ForbiddenException("IMAGE_NOT_OWNED");
        }
        return image;
    }
}
