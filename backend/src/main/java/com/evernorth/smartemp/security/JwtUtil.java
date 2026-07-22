package com.evernorth.smartemp.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import javax.crypto.SecretKey;
import java.util.Base64;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {
    @Value("${app.jwt.secret}") private String secret;
    @Value("${app.jwt.expiration-ms}") private long expirationMs;

    private SecretKey signingKey() {
        return Keys.hmacShaKeyFor(Base64.getDecoder().decode(secret));
    }
    public String generateToken(UserDetails userDetails) {
        Date now = new Date();
        return Jwts.builder().subject(userDetails.getUsername()).issuedAt(now)
                .expiration(new Date(now.getTime() + expirationMs)).signWith(signingKey(), Jwts.SIG.HS256).compact();
    }
    public String extractUsername(String token) { return extractClaim(token, Claims::getSubject); }
    public <T> T extractClaim(String token, Function<Claims, T> resolver) {
        return resolver.apply(Jwts.parser().verifyWith(signingKey()).build().parseSignedClaims(token).getPayload());
    }
    public boolean isTokenValid(String token, UserDetails userDetails) {
        try { return extractUsername(token).equals(userDetails.getUsername()) && !extractClaim(token, Claims::getExpiration).before(new Date()); }
        catch (JwtException | IllegalArgumentException ex) { return false; }
    }
}
