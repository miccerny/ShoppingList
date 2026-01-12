package michal.entity.enumy;

import lombok.Getter;

import java.util.Arrays;
import java.util.Optional;

/**
 * Enumeration of supported image types.
 *
 * <p>
 * This enum defines which image formats are allowed to be uploaded.
 * Each type is associated with its corresponding MIME content type.
 * </p>
 */
@Getter
public enum ImageType {

    // Common web image formats.
    JPEG("image/jpeg", ".jpeg"),
    JPG("image/jpg", ".jpg"),
    PNG("image/png", ".png"),
    WEBP("image/webp", ".webp");

    /**
     * MIME content type sent by the client / detected by the server.
     */
    private final String contentType;
    /**
     * Typical file extension used when storing files on disk.
     */
    private final String extension;

    ImageType(String contentType, String extension) {
        this.contentType = contentType;
        this.extension = extension;
    }

    public String getContentType() {
        return contentType;
    }

    public String getExtension() {
        return extension;
    }

    /**
     * Finds an {@link ImageType} by MIME content type.
     *
     * <p>
     * Example: {@code "image/png" -> michal.entity.enumy.ImageType.PNG}.
     * Returns {@link Optional#empty()} when the input is null or not supported.
     * </p>
     *
     * @param contentType MIME content type (e.g. "image/png")
     * @return matching ImageType wrapped in Optional
     */
    public static Optional<ImageType> fromContentType(String contentType) {
        if (contentType == null) {
            return Optional.empty();
        }

        // Iterate over enum constants and find the first that matches the given MIME type.
        return Arrays.stream(values())
                .filter(t -> t.contentType.equalsIgnoreCase(contentType))
                .findFirst();
    }
}
