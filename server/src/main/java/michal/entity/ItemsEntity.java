package michal.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

/**
 * Entity representing an item in a shopping list.
 * <p>
 * Mapped to the database table "items".
 */
@Entity(name = "items")
@Getter
@Setter
public class ItemsEntity {

    /** Unique identifier of the item. */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "items_seq")
    @SequenceGenerator(name = "items_seq", sequenceName = "items_seq", allocationSize = 1)
    private Long id;

    /** Name of the item, for example "Milk" or "Bread". */
    @Column
    private String name;

    /** Quantity or count of the item. */
    @Column
    private float count;

    /** The list this item belongs to. */
    @ManyToOne(optional = false)
    @JoinColumn(name = "list_id")
    private ListEntity list;

    /** Indicates whether the item is checked (completed). */
    @Column
    private boolean purchased;

    @OneToOne(mappedBy = "itemId", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private ItemsImageEntity image;

}
