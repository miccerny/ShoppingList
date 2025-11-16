package michal.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Entity representing a shopping list.
 * <p>
 * Mapped to the database table "lists".
 */
@Entity(name = "lists")
@Getter
@Setter
public class ListEntity {

    /** Unique identifier of the list. */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "lists_seq")
    @SequenceGenerator(name = "lists_seq", sequenceName = "lists_seq", allocationSize = 1)
    private Long id;

    /** Name of the shopping list. */
    @Column
    private String name;

    /** List of items that belong to this shopping list. */
    @OneToMany(mappedBy = "list", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemsEntity> items;

    /** User who owns this list. */
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = true)
    private UserEntity owner;

    @OneToMany(mappedBy = "list", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<SharedListEntity> sharedWith = new HashSet<>();
}
