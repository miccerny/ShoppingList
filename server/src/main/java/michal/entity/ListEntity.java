package michal.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity(name = "lists")
@Getter
@Setter
public class ListEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "lists_seq")
    @SequenceGenerator(name = "lists_seq", sequenceName = "lists_seq", allocationSize = 1)
    private long id;

    @Column
    private String name;

    @OneToMany(mappedBy = "list", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemsEntity> items;

    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private UserEntity owner;

}
