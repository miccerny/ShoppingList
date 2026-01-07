package michal.service;

import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
public interface StorageService {

    Resource loadAsResource(Long userId, String storedName);
    void save(Long userId, String storedName, InputStream inputStream);
    void deleteStoredFile(Long userId, String storedName);
}
