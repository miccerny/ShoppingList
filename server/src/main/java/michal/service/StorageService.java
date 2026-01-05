package michal.service;

import org.springframework.stereotype.Service;

import java.io.InputStream;

@Service
public interface StorageService {

    void save(Long userId, String storedName, InputStream inputStream);
    void delete(Long userId, String storedName);
}
