package michal.service;

import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.InputStream;

/**
 * Service interface for low-level file storage operations.
 *
 * <p>
 * This service is responsible for storing, loading and deleting files
 * (typically images) from a storage system such as the file system.
 * </p>
 *
 * <p>
 * Files are stored per user, identified by {@code userId},
 * to keep data isolated between users.
 * </p>
 */
@Service
public interface StorageService {

    /**
     * Service interface for low-level file storage operations.
     *
     * <p>
     * This service is responsible for storing, loading and deleting files
     * (typically images) from a storage system such as the file system.
     * </p>
     *
     * <p>
     * Files are stored per user, identified by {@code userId},
     * to keep data isolated between users.
     * </p>
     */
    Resource loadAsResource(Long userId, String storedName);

    /**
     * Saves a file into storage.
     *
     * <p>
     * The file content is read from the provided {@link InputStream}
     * and stored under the given internal file name.
     * </p>
     *
     * @param userId ID of the user who owns the file
     * @param storedName internal stored file name
     * @param inputStream input stream containing file data
     */
    void save(Long userId, String storedName, InputStream inputStream);

    /**
     * Deletes a stored file from storage.
     *
     * <p>
     * This method removes the physical file associated with the given user
     * and stored file name.
     * </p>
     *
     * @param userId ID of the user who owns the file
     * @param storedName internal stored file name
     */
    void deleteStoredFile(Long userId, String storedName);
}
