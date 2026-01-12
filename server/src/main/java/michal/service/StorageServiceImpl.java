package michal.service;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

/**
 * File system-based implementation of {@link StorageService}.
 *
 * <p>
 * This service stores files on the local file system under a root directory.
 * Files are organized by user ID to separate data between users.
 * </p>
 */
@Service
public class StorageServiceImpl implements StorageService{

    /**
     * Root directory where all uploaded files are stored.
     */
    private static final String ROOT_DIR = "uploads";

    /**
     * Saves a file into the storage.
     *
     * <p>
     * The file is stored under a directory named by the user ID.
     * If the directory does not exist, it is created.
     * </p>
     *
     * @param userId ID of the user who owns the file
     * @param storedName internal filename used for storage
     * @param inputStream input stream containing the file data
     */
    @Override
    @Transactional
    public void save(Long userId, String storedName, InputStream inputStream){
        try{
            // Create user-specific directory if it does not exist.
            Path userDir = Paths.get(ROOT_DIR, userId.toString());
            Files.createDirectories(userDir);

            // Resolve target file path and copy file content.
            Path targetFile = userDir.resolve(storedName);
            Files.copy(inputStream, targetFile, StandardCopyOption.REPLACE_EXISTING);

            // Debug logs to help during development.
            System.out.println("WORKDIR = " + Paths.get("").toAbsolutePath());
            System.out.println("IMAGE SAVED TO: " + targetFile.toAbsolutePath());
        }catch (IOException e){
            // Wrap checked exception into runtime exception.
            throw new RuntimeException("FAILED_TO_STORE_FILE", e);
        }
    }

    /**
     * Loads a stored file as a {@link Resource}.
     *
     * <p>
     * The resource can be returned directly from a REST controller
     * to send the file to the client.
     * </p>
     *
     * @param userId ID of the user who owns the file
     * @param storedName internal filename used for storage
     * @return file resource
     */
    @Override
    @Transactional(readOnly = true)
    public Resource loadAsResource(Long userId, String storedName) {
        try {
            // Build the path to the stored file.
            Path file = Paths.get("uploads", userId.toString(), storedName);

            // Create a URL-based resource from the file path.
            Resource resource = new UrlResource(file.toUri());

            // Check if the file exists and is readable.
            if(!resource.exists() ||!resource.isReadable()){
                throw new RuntimeException("FILE_NOT_FOUND");
            }
            // Debug log for successful load.
            System.out.println("File:  " + file + " was loaded.");
            return  resource;
        }catch (Exception e){
            throw new RuntimeException("FILE_LOAD_FAILED", e);
        }
    }

    /**
     * Deletes a stored file from the storage.
     *
     * <p>
     * If the file does not exist, the method does nothing.
     * </p>
     *
     * @param userId ID of the user who owns the file
     * @param storedName internal filename used for storage
     */
    @Override
    @Transactional
    public void deleteStoredFile(Long userId, String storedName){
        try{
            // Build path to the stored file.
            Path file = Paths.get(ROOT_DIR, userId.toString(), storedName);

            // Delete file if it exists.
            Files.deleteIfExists(file);

            // Debug log for delete operation.
            System.out.println("File was removed " + file);
        }catch (IOException e){
            throw new RuntimeException("FAILED_TO_DELETE_FILE", e);
        }
    }
}
