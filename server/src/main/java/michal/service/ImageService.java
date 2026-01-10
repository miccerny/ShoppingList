package michal.service;

import michal.entity.UserEntity;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service interface for working with item images.
 *
 * <p>
 * This service defines operations for loading, uploading,
 * updating and deleting images associated with items.
 * </p>
 *
 * <p>
 * All methods expect an authenticated user in order to
 * verify access permissions.
 * </p>
 */
public interface ImageService {

    /**
     * Loads an image resource by its ID.
     *
     * <p>
     * The method also verifies that the given user
     * has permission to access the image.
     * </p>
     *
     * @param imageId ID of the image
     * @param user authenticated user
     * @return image resource that can be returned to the client
     */
    Resource loadImage(Long imageId, UserEntity user);

    /**
     * Returns the MIME content type of an image.
     *
     * <p>
     * This value is typically used to set the
     * {@code Content-Type} HTTP header when returning the image.
     * </p>
     *
     * @param imageId ID of the image
     * @param user authenticated user
     * @return image content type (e.g. "image/png")
     */
    String getImageContentType(Long imageId, UserEntity user);

    /**
     * Uploads or updates an image for a specific item.
     *
     * <p>
     * If the item already has an image, the existing image
     * may be replaced.
     * </p>
     *
     * <p>
     * The method validates:
     * <ul>
     *   <li>user permissions</li>
     *   <li>image type</li>
     *   <li>image size</li>
     * </ul>
     * </p>
     *
     * @param itemId ID of the item
     * @param file uploaded image file
     * @param user authenticated user
     */
    void updateItemImage(Long itemId, MultipartFile file, UserEntity user);

    /**
     * Deletes an image associated with an item.
     *
     * <p>
     * This method verifies that the given user
     * has permission to modify the item.
     * </p>
     *
     * @param itemId ID of the item
     * @param user authenticated user
     */
    void deleteItemImage(Long itemId, UserEntity user);
}
