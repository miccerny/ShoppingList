package michal.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;

/**
 * Entity representing an application user.
 * <p>
 * Implements {@link UserDetails} for Spring Security authentication.
 * Mapped to the database table "users".
 */
@Entity(name = "users")
@Getter
@Setter
public class UserEntity implements UserDetails {

    /** Unique identifier of the user. */
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "users_seq")
    @SequenceGenerator(name = "users_seq", sequenceName = "users_seq", allocationSize = 1)
    private Long id;

    /** Email address of the user (used as username). */
    @Column(nullable = false, unique = true, name = "username")
    private String email;

    /** Encrypted password of the user. */
    @Column(nullable = false)
    private String password;

    /** All shopping lists owned by this user. */
    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ListEntity> lists;

    /** Returns the user's email as the username for authentication. */
    @Override
    public String getUsername() {
        return email;
    }

    /** Returns the default user role. */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}
