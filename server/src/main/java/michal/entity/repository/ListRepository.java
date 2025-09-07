package michal.entity.repository;

import michal.dto.ItemsDTO;
import michal.dto.ListDTO;
import michal.entity.ItemsEntity;
import michal.entity.ListEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@EnableJpaRepositories
@Repository
public interface ListRepository extends JpaRepository<ListEntity, Long> {


}
