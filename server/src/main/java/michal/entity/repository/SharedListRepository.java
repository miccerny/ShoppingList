package michal.entity.repository;

import michal.entity.SharedListEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SharedListRepository extends JpaRepository<SharedListEntity, Long> {

    List<SharedListEntity> findByListId(Long listId);
    boolean existsByListIdAndUserId(Long listId, Long userId);

}
