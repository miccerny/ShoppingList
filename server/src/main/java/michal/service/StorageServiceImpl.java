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

@Service
public class StorageServiceImpl implements StorageService{

    private static final String ROOT_DIR = "uploads";

    @Override
    @Transactional
    public void save(Long userId, String storedName, InputStream inputStream){
        try{
            Path userDir = Paths.get(ROOT_DIR, userId.toString());
            Files.createDirectories(userDir);

            Path targetFile = userDir.resolve(storedName);
            Files.copy(inputStream, targetFile, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("WORKDIR = " + Paths.get("").toAbsolutePath());
            System.out.println("IMAGE SAVED TO: " + targetFile.toAbsolutePath());
        }catch (IOException e){
            throw new RuntimeException("FAILED_TO_STORE_FILE", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Resource loadAsResource(Long userId, String storedName) {
        try {
            Path file = Paths.get("uploads", userId.toString(), storedName);
            Resource resource = new UrlResource(file.toUri());
            if(!resource.exists() ||!resource.isReadable()){
                throw new RuntimeException("FILE_NOT_FOUND");
            }
            return  resource;
        }catch (Exception e){
            throw new RuntimeException("FILE_LOAD_FAILED", e);
        }
    }

    @Override
    @Transactional
    public void deleteStoredFile(Long userId, String storedName){
        try{
            Path file = Paths.get(ROOT_DIR, userId.toString(), storedName);
            Files.deleteIfExists(file);
        }catch (IOException e){
            throw new RuntimeException("FAILED_TO_DELETE_FILE", e);
        }
    }
}
