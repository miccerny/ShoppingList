package michal.entity.repository;

import michal.entity.ItemsImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ImageRepository extends JpaRepository<ItemsImageEntity, Long> {

}
