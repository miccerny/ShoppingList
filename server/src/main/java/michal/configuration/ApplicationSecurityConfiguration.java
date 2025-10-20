package michal.configuration;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

/**
 * This class is the main security configuration for the Spring Boot application.
 * It defines password encoding, CORS rules, allowed requests, and logout/login behavior.
 * <p>
 * The @Configuration annotation tells Spring that this class provides configuration.
 * The @EnableWebSecurity enables Spring Security for the whole application.
 */
@Configuration
@EnableWebSecurity
public class ApplicationSecurityConfiguration {

    /**
     * This bean is used to encode passwords.
     * BCrypt is a strong hashing algorithm that makes passwords more secure.
     *
     * @return a PasswordEncoder object that uses BCrypt algorithm
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * This method defines the main security filter chain.
     * It sets rules for which endpoints are public and which require authentication.
     * It also disables CSRF for APIs and sets custom JSON responses for logout and unauthorized access.
     *
     * @param http the HttpSecurity object used to configure web-based security
     * @return a configured SecurityFilterChain
     * @throws Exception if there is any configuration error
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                // Disable CSRF because this is a REST API, not a traditional web form app
                .csrf(csrf -> csrf.disable())

                // Enable and configure CORS rules (frontend origin etc.)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // Define which requests are allowed without login
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/register", "/api/login").permitAll() // public endpoints
                        .requestMatchers("/api/list/**").permitAll() // public list endpoints
                        .anyRequest().authenticated() // everything else requires login
                )
                // Configure logout endpoint and response
                .logout(logout -> logout
                        .logoutUrl("/api/logout")
                        .logoutSuccessHandler((request, response, authentication) -> {
                            response.setContentType("application/json");
                            response.getWriter().write("{\"message\": \"Odhlášen\"}");
                        })
                )
                // Handle unauthorized users trying to access protected endpoints
                .exceptionHandling(e -> e
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write("{\"error\": \"Nepřihlášený uživatel\"}");
                        })
                )

                // Finally, build the configured security filter chain
                .build();
    }

    /**
     * This bean defines the CORS (Cross-Origin Resource Sharing) configuration.
     * It allows the frontend (for example React app on localhost:5173) to access the backend.
     *
     * @return the CORS configuration source
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allow requests from this origin (React dev server)
        configuration.setAllowedOriginPatterns(List.of("http://localhost:5173"));

        // Allow common HTTP methods
        configuration.setAllowedMethods(List.of("HEAD", "GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allow all headers (like Authorization, Content-Type, etc.)
        configuration.setAllowedHeaders(List.of("*"));

        // Allow sending cookies or authorization headers
        configuration.setAllowCredentials(true);

        // Register this configuration for all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    /**
     * This bean provides the AuthenticationManager which is needed for authentication process.
     * It connects Spring Security with our login logic.
     *
     * @param configuration Spring's AuthenticationConfiguration
     * @return the AuthenticationManager bean
     * @throws Exception if the manager cannot be created
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }
}