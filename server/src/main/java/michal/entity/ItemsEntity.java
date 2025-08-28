package michal.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity(name = "items")
@Getter
@Setter
public class ItemsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "items_seq")
    @SequenceGenerator(name = "items_seq", sequenceName = "items_seq", allocationSize = 1)
    private long id;

    @Column
    private String name;

    @Column
    private float count;

    @ManyToOne
    @JoinColumn(name= "list_id")
    private ListEntity list;

}
