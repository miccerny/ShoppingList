package michal.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import michal.entity.enumy.ImageType;

import java.time.LocalDate;

@Entity(name = "image")
@Getter
@Setter
public class ItemsImageEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "images_seq")
    @SequenceGenerator(name = "images_seq", sequenceName = "images_seq", allocationSize = 1)
    private Long id;

    @Column
    private String storedName;

    @Enumerated(EnumType.STRING)
    @Column
    private ImageType contentType;

    @Column
    private String originalName;

    @OneToOne
    @JoinColumn(name = "item_id", unique = true, nullable = false)
    private ItemsEntity item;

    @Column
    private LocalDate createdAt;

    @Column
    private Long size;
}
