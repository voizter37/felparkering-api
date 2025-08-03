package se.voizter.felparkering.api.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import se.voizter.felparkering.api.type.Role;

/**
 * Skapar, validerar och läser information från JWT-tokens.
 */
@Component
public class JwtProvider {
    /**
     * Hemlig nyckel som används för att signera och verifiera JWT-token.
     * Sätts via konfigurationen i {@code .env}.
     */
    @Value("${jwt.secret}")
    private String secretKey;

    /**
     * Tidsgräns för hur länge token är giltig. i millisekunder.
     */
    @Value("${jwt.expiration}")
    private long expiration;
    
    /**
     * Genererar en signerad JWT-token för en autentiserad användare.
     * 
     * Tokenen innehåller:
     * - Subject: användarens e-post.
     * - Claim "role": användarens roll.
     * - Issued at: tidpunkten då token skapades.
     * - Expiration: hur länge tokenen är giltig.
     * 
     * @param email användarens e-post.
     * @param role användarens roll.
     * @return en signerad JWT-token.
     */
    public String generateToken(String email, Role role) {
        SecretKey key = Keys.hmacShaKeyFor(secretKey.getBytes()); // Genererar en nyckel utifrån den hemliga nyckeln baserat på HMAC-algoritmen.

        return Jwts.builder()
            .subject(email)
            .claim("role", role.toString())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .issuedAt(new Date())
            .signWith(key, Jwts.SIG.HS256)
            .compact();
        
    }

    /**
     * Validerar en given JWT-token och kontrollerar att den är signerad och inte har gått ut.
     * 
     * @param token JWT-token att validera.
     * @return {@code true} om tokenen är giltig, annars {@code false}.
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                .verifyWith(Keys.hmacShaKeyFor(secretKey.getBytes()))
                .build()
                .parseSignedClaims(token);
            return true;
        } catch (JwtException e) {
            return false;
        }
    }

    /**
     * Hämtar användarens e-post från en JWT-token.
     * 
     * @param token en giltig JWT-token.
     * @return e-post som finns i tokenens "subject"-fält.
     */
    public String getEmail(String token) {
        return Jwts.parser()
            .verifyWith(Keys.hmacShaKeyFor(secretKey.getBytes()))
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject();
    }

    /**
     * Hämtar användarens roll från en JWT-token.
     * 
     * @param token en giltig JWT-token.
     * @return användarens roll som finns tokenens "claim"-fält under "role". 
     */
    public String getRole(String token) {
        return Jwts.parser()
            .verifyWith(Keys.hmacShaKeyFor(secretKey.getBytes()))
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .get("role", String.class);
    }
}
