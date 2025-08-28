package michal.entity.repository;

import michal.entity.ItemsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemsRepository extends JpaRepository<ItemsEntity, Long> {
}
