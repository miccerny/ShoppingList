package michal.entity.repository;

import michal.entity.ItemsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ItemsRepository extends JpaRepository<ItemsEntity, Long> {

    List<ItemsEntity> findByListId(Long listId);

    long countByListId(Long id);
}
