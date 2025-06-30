package se.voizter.felparkering.api.security;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import se.voizter.felparkering.api.model.User;
import se.voizter.felparkering.api.repository.UserRepository;

/**
 * JWT-filter som körs en gång per inkommande request för att kontrollera JWT-token.
 */
public class JwtFilter extends OncePerRequestFilter{
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    /**
     * Skapar en ny instans av {@code JwtFilter}.
     * 
     * @param jwtProvider komponent för att validera och tolka JWT-token.
     * @param userRepository repository för att slå upp användare via e-post.
     */
    public JwtFilter(JwtProvider jwtProvider, UserRepository userRepository) {
        this.jwtProvider = jwtProvider;
        this.userRepository = userRepository;
    }
    
    /**
     * Filtrerar varje inkommande HTTP-request för att kontrollera JWT-token.
     * 
     * Om Authorization-headern innehåller en giltig token, valideras den och autentiserar användaren. 
     * En {@link UsernamePasswordAuthenticationToken} lagras i {@link SecurityContextHolder} för att ge tillgång till skyddade uppgifter.
     * 
     * @param request inkommande HTTP-request.
     * @param response HTTP-responsen.
     * @param chain filterkedjan som fortsätter request-processen.
     * @throws ServletException om något servletrelaterat fel uppstår.
     * @throws IOException om något IO-fel uppstår.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        String bearerToken = request.getHeader("Authorization");

        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            String token = bearerToken.substring(7); // Plockar ut token utan "Bearer "-prefixet.
            if (jwtProvider.validateToken(token)) {
                String email = jwtProvider.getEmail(token);
                Optional<User> maybeUser = userRepository.findByEmail(email);
                if (maybeUser.isPresent()) {
                    User user = maybeUser.get();
                    UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        user, 
                        null, 
                        List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                    );
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        }
        chain.doFilter(request, response); // Fortsätter vidare i filterekdjan.
    }
}
