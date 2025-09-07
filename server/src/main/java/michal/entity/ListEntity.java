package michal.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Entity(name = "lists")
@Getter
@Setter
public class ListEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "lists_seq")
    @SequenceGenerator(name = "lists_seq", sequenceName = "lists_seq", allocationSize = 1)
    private long id;

    @Column
    private String name;

    @OneToMany(mappedBy = "list", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemsEntity> items;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = true)
    private UserEntity owner;


}
