package se.voizter.felparkering.api.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import se.voizter.felparkering.api.repository.UserRepository;
import se.voizter.felparkering.api.security.JwtFilter;
import se.voizter.felparkering.api.security.JwtProvider;

/**
 * Konfigurerar inställningar med JWT autentisering.
 * Hanterar vilka endpoints som kräver autentisering och vilka roller som har åtkomst.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private JwtProvider jwtProvider;

    @Autowired
    private UserRepository userRepository;

    /**
     * Konfigurerar de filter som säkerhetskedjan ska innehålla.
     * - Tillåter alla för inloggning och registrering
     * - Skyddar admin- och rapportendpoints baserat på roll.
     * - Stänger av sessionshantering och använder istället JWT autentisering.
     * 
     * @param http HttpSecurity-instansen som konfigureras.
     * @return Konfigurerad {@link SecurityFilterChain}
     * @throws Exception vid konfigurationsfel
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable); // Inaktiverar CSRF då vi använder JWT.

        http.authorizeHttpRequests(auth -> auth // Definerar behörigheter till olika endpoints
            .requestMatchers("/login", "/register").permitAll()
            .requestMatchers("/admin/**").hasRole("ADMIN")
            .requestMatchers("/reports").hasAnyRole("ADMIN", "ATTENDANT")
            .anyRequest().authenticated() // Övriga endpoints kräver autentisering
        )
        .sessionManagement(sessionManagementCustomizer -> sessionManagementCustomizer // Skapar inga session då vi använder JWT
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS))  

        .addFilterBefore(new JwtFilter(jwtProvider, userRepository), UsernamePasswordAuthenticationFilter.class); // Lägger till ett JWT-filter före standardfiltret för användarnamn och lösenord.
    
        return http.build();
    }
}
