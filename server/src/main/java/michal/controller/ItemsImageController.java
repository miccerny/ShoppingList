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

@RestController
public class ItemsImageController {

    @Autowired
    private ImageService imageService;

    @GetMapping("/api/images/{imageId}")
    public ResponseEntity<Resource> getImage(@PathVariable Long imageId,
                                             @AuthenticationPrincipal UserEntity user){
        Resource image = imageService.loadImage(imageId, user);
        String contentType = imageService.getImageContentType(imageId, user);
        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(contentType))
                .body(image);
    }

    @DeleteMapping("/api/list/{listId}/items/{itemId}/image")
    public ResponseEntity<Void> deleteItemImage(
            @PathVariable Long listId,
            @PathVariable Long itemId,
            @AuthenticationPrincipal UserEntity user
    ){
        imageService.deleteItemImage(itemId, user);
        return ResponseEntity.noContent().build();
    }
}
