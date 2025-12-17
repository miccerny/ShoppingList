package michal.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Entity representing a shared access entry for a shopping list.
 * <p>
 * Each record links a specific list to a user who has been granted access.
 * This table acts as a join table between {@link ListEntity} and
 * {@link UserEntity}, with a unique constraint to prevent duplicate sharing
 * of the same list with the same user.
 * </p>
 */
@Entity
@Table(
        name = "shared_lists",
        uniqueConstraints = @UniqueConstraint(columnNames = {"list_id", "user_id"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SharedListEntity {

    /**
     * Unique identifier of this shared-list relation.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "lists_seq")
    @SequenceGenerator(name = "lists_seq", sequenceName = "lists_seq", allocationSize = 1)
    private Long id;

    /**
     * The list that is being shared.
     */
    @ManyToOne
    @JoinColumn(name = "list_id")
    private ListEntity list;

    /**
     * The user who has been granted access to the list.
     */
    @ManyToOne
    @JoinColumn(name = "user_id")
    private UserEntity user;

}
