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

    /** Maximum allowed uploaded file size (5 MB). */
    private static final long MAX_SIZE_BYTES = 5L * 1024 * 1024; // 5MB

    /**
     * Uploads or replaces an image for a given item.
     *
     * <p>
     * This method performs:
     * <ul>
     *   <li>basic file checks (null/empty)</li>
     *   <li>ownership (authorization) check</li>
     *   <li>file size validation</li>
     *   <li>content type validation using {@link ImageType}</li>
     *   <li>storing file in storage</li>
     *   <li>creating and saving {@link ItemsImageEntity}</li>
     *   <li>cleanup of the old image (database + storage)</li>
     * </ul>
     * </p>
     *
     * @param itemId ID of the item
     * @param file uploaded file (multipart)
     * @param userEntity authenticated user
     */
    @Override
    @Transactional
    public void updateItemImage(Long itemId, MultipartFile file, UserEntity userEntity) {

        // The image is optional: if no file is provided, do nothing.
        if(file == null || file.isEmpty()){
            return;
        }

        // Load item from DB (or fail if it does not exist).
        ItemsEntity item = itemsRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("ITEM_NOT_FOUND"));

        // Ownership check: only list owner can modify the item image.
        if(!item.getList().getOwner().getId().equals(userEntity.getId())){
            throw new ForbiddenException("ITEM_NOT_OWNED");
        }

        // File size validation.
        if (file.getSize() > MAX_SIZE_BYTES) {
            throw new ValidationException(ValidationErrorCode.IMAGE_TOO_LARGE);
        }

        // Convert content type (e.g. "image/png") to enum ImageType.
        String contentType = file.getContentType();
        ImageType imageType = ImageType.fromContentType(contentType)
                .orElseThrow(() -> new ValidationException(
                        ValidationErrorCode.IMAGE_TYPE_NOT_ALLOWED
                ));

        // Save old image details for cleanup (DB record + stored file).
        ItemsImageEntity old = item.getImage(); // this might be null if item has no image yet
        Long oldId = old != null ? old.getId() : null;
        String oldStoredName = old != null ? old.getStoredName() : null;


        // Generate a new internal storage filename (random UUID + extension).
        String newStoredName = UUID.randomUUID() + imageType.getExtension();

        // Store the uploaded file into storage (file system / cloud / etc.).
        try (InputStream in = file.getInputStream()) {
            storageService.save(userEntity.getId(), newStoredName, in);
        } catch (IOException e) {
            throw new RuntimeException("IMAGE_SAVE_FAILED", e);
        }

        // Create new image entity (metadata) and connect it to the item.
        ItemsImageEntity newImage = itemsImageMapper.fromUpload(file, imageType);
        newImage.setStoredName(newStoredName);
        newImage.setItem(item);
        newImage.setCreatedAt(LocalDate.now());

        try {
            // Persist the new image entity.
            ItemsImageEntity savedImage = imageRepository.save(newImage);

            // Link the saved image to the item (item is managed in current transaction).
            item.setImage(savedImage);

            // Cleanup old image: remove DB record and also delete stored file.
            if (oldId != null) {
                imageRepository.deleteById(oldId);
                if (oldStoredName != null) {
                    storageService.deleteStoredFile(userEntity.getId(), oldStoredName);
                }
            }

        } catch (RuntimeException e) {
            // If DB operation fails, the new file is already stored -> clean it up to avoid orphan files.
            storageService.deleteStoredFile(userEntity.getId(), newStoredName);
            throw e;
        }

    }

    /**
     * Loads an image as a Spring {@link Resource} for sending to the client.
     *
     * @param imageId ID of the image
     * @param user authenticated user (used for access check)
     * @return image resource loaded from storage
     */
    @Override
    @Transactional(readOnly = true)
    public Resource loadImage(Long imageId, UserEntity user) {
        ItemsImageEntity image = getOwnedImage(imageId, user);
        return storageService.loadAsResource(
                user.getId(),
                image.getStoredName()
        );
    }

    /**
     * Returns the MIME content type of the requested image.
     *
     * @param imageId ID of the image
     * @param user authenticated user (used for access check)
     * @return MIME type string (e.g. "image/png")
     */
    @Override
    @Transactional(readOnly = true)
    public String getImageContentType(Long imageId, UserEntity user) {
        ItemsImageEntity image = getOwnedImage(imageId, user);
        return image.getContentType().getContentType(); // nebo image.getContentType()
    }

    /**
     * Deletes the image associated with the given item.
     *
     * <p>
     * This method performs:
     * <ul>
     *   <li>item lookup</li>
     *   <li>ownership check</li>
     *   <li>unlink image from item</li>
     *   <li>delete stored file</li>
     * </ul>
     * </p>
     *
     * @param itemId ID of the item
     * @param user authenticated user
     */
    @Override
    @Transactional
    public void deleteItemImage(Long itemId, UserEntity user) {
        ItemsEntity item = itemsRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("ITEM_NOT_FOUND"));

        // Only list owner is allowed to delete the image.
        if (!item.getList().getOwner().getId().equals(user.getId())) {
            throw new ForbiddenException("ITEM_NOT_OWNED");
        }
        // If item has no image, there is nothing to delete.
        ItemsImageEntity image = item.getImage();
        if (image == null) return;

        String storedName = image.getStoredName();

        // DB: unlink image from item (orphanRemoval may delete the image entity).
        item.setImage(null);
        itemsRepository.save(item);

        // FILE: delete the stored file.
        storageService.deleteStoredFile(user.getId(), storedName);
    }

    /**
     * Loads an image entity and verifies that the given user is the owner.
     *
     * <p>
     * This helper is used by read operations (load image, get content type),
     * so that access control is always enforced.
     * </p>
     *
     * @param imageId ID of the image entity
     * @param user authenticated user
     * @return owned image entity
     */
    private ItemsImageEntity getOwnedImage(Long imageId, UserEntity user) {
        ItemsImageEntity image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("IMAGE_NOT_FOUND"));

        // Ownership check based on the list owner.
        Long ownerId = image.getItem().getList().getOwner().getId();
        if (!ownerId.equals(user.getId())) {
            throw new ForbiddenException("IMAGE_NOT_OWNED");
        }
        return image;
    }
}
