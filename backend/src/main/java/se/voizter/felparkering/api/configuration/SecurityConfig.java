package se.voizter.felparkering.api.configuration;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.SecurityContextHolderFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import jakarta.servlet.http.HttpServletResponse;
import se.voizter.felparkering.api.security.JwtFilter;
import se.voizter.felparkering.api.security.JwtProvider;

/**
 * Konfigurerar inställningar med JWT autentisering.
 * Hanterar vilka endpoints som kräver autentisering och vilka roller som har åtkomst.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    private final JwtProvider jwtProvider;

    public SecurityConfig(JwtProvider jwtProvider) {
        this.jwtProvider = jwtProvider;
    }

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
        http.csrf(AbstractHttpConfigurer::disable) // Inaktiverar CSRF då vi använder JWT.
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth // Definerar behörigheter till olika endpoints
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            .requestMatchers("/login", "/register").permitAll()
            .requestMatchers("/admin/**").hasRole("ADMIN")
            .requestMatchers("/attendant/**").hasRole("ATTENDANT")
            .requestMatchers("/home/**").hasRole("CUSTOMER")
            .requestMatchers(HttpMethod.POST, "/addresses/route").hasRole("ATTENDANT")
            .anyRequest().authenticated() // Övriga endpoints kräver autentisering
        )
        .addFilterAfter(new JwtFilter(jwtProvider), SecurityContextHolderFilter.class)
        .exceptionHandling(e -> e
            .authenticationEntryPoint((req, res, ex) -> {
                var a = SecurityContextHolder.getContext().getAuthentication();
                System.out.println("AUTH ENTRY (401) " + req.getMethod() + " " + req.getRequestURI()
                    + " ex=" + ex.getClass().getSimpleName() + " auth=" + a);
                res.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            })
        );
        return http.build();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
            CorsConfiguration config = new CorsConfiguration();
            config.setAllowedOriginPatterns(List.of(
                "https://*.netlify.app",
                "http://localhost:8081"
            ));
            config.setAllowedMethods(List.of("*"));
            config.setAllowedHeaders(List.of("*"));
            config.setExposedHeaders(List.of("Authorization"));
            config.setAllowCredentials(true);

            UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	        source.registerCorsConfiguration("/**", config);
            return source;
    }

}
