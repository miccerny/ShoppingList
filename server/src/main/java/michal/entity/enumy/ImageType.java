package michal.entity.enumy;

import lombok.Getter;

import java.util.Arrays;
import java.util.Optional;

@Getter
public enum ImageType {

    JPEG("image/jpeg", ".jpeg"),
    JPG("image/jpg", ".jpg"),
    PNG("image/png", ".png"),
    WEBP("image/webp", ".webp");

    private final String contentType;
    private final String extension;

    ImageType(String contentType, String extension){
        this.contentType = contentType;
        this.extension = extension;
    }

    public String getContentType() {
        return contentType;
    }

    public String getExtension() {
        return extension;
    }

    public static Optional<ImageType> fromContentType(String contentType) {
        if (contentType == null) {
            return Optional.empty();
        }

        return Arrays.stream(values())
                .filter(t -> t.contentType.equalsIgnoreCase(contentType))
                .findFirst();
    }
}
