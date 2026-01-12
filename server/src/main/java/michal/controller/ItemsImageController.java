package michal.controller;

import michal.entity.UserEntity;
import michal.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

/**
 * Creates a controller responsible for serving and deleting item images.
 */
@RestController
public class ItemsImageController {

    @Autowired
    private ImageService imageService;

    /**
     * Returns an image file by its identifier.
     *
     * <p>
     * The image is returned as a {@link Resource} with a proper Content-Type header
     * so the browser can display it directly.
     * </p>
     *
     * @param imageId ID of the image to load
     * @param user currently authenticated user
     * @return HTTP 200 response containing the image resource
     */
    @GetMapping("/api/images/{imageId}")
    public ResponseEntity<Resource> getImage(@PathVariable Long imageId,
                                             @AuthenticationPrincipal UserEntity user){
        // Load the file as a Spring Resource (e.g., file system or other storage).
        Resource image = imageService.loadImage(imageId, user);

        // Determine the MIME type (e.g., image/jpeg, image/png) for the response header.
        String contentType = imageService.getImageContentType(imageId, user);


        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(contentType))
                .body(image);
    }

    /**
     * Deletes the image assigned to an item.
     *
     * <p>
     * This endpoint removes the image association from the item and may also delete
     * the underlying stored file (depending on service implementation).
     * </p>
     *
     * @param listId ID of the list (used for routing/authorization)
     * @param itemId ID of the item whose image should be removed
     * @param user currently authenticated user
     * @return HTTP 204 No Content when deletion succeeds
     */
    @DeleteMapping("/api/list/{listId}/items/{itemId}/image")
    public ResponseEntity<Void> deleteItemImage(
            @PathVariable Long listId,
            @PathVariable Long itemId,
            @AuthenticationPrincipal UserEntity user
    ){
        // Delegate authorization checks and deletion logic to the service layer.
        imageService.deleteItemImage(itemId, user);
        return ResponseEntity.noContent().build();
    }
}
