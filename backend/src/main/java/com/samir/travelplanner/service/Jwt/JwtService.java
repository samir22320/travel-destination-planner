package com.samir.travelplanner.service.Jwt;

import com.samir.travelplanner.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.*;
import java.util.function.Function;

@Service
public class JwtService {

    private String secreteKey = null;
    private static final long ACCESS_TOKEN_EXP = 1000 * 60 * 10;// 10 min
    private static final long REFRESH_TOKEN_EXP = 1000 * 60 * 60 * 24 * 7; // 7 days

    public String generateAccessToken(User user) {
        Map<String, Object> claims = new HashMap<>(); // Fixed generics
        claims.put("role", user.getRole());
        return Jwts
                .builder()
                .claims(claims) // Add claims
                .subject(user.getUsername())
                .issuer("travelPlanner")
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + ACCESS_TOKEN_EXP))
                .signWith(generateKey())
                .compact();
    }

    public String generateRefreshToken(User user) {
        return Jwts.builder()
                .subject(user.getUsername())
                .issuer("travelPlanner")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + REFRESH_TOKEN_EXP))
                .signWith(generateKey())
                .compact();
    }

    private SecretKey generateKey() {
        byte[] decode = Decoders.BASE64.decode(getSecreteKey());
        return Keys.hmacShaKeyFor(decode);
    }

    public String getSecreteKey() {
        return secreteKey = "HEVMGedN3x+j5JbH1jvDnghvGLQesa9Azy6HHpJPdek=";
    }

    public String extractUserName(String token) {
        return extractClaims(token, Claims::getSubject);
    }

    private <T> T extractClaims(String token, Function<Claims, T> claimResolver) {
        Claims claims = extractClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(generateKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isValid(String token, UserDetails userDetails) {
        final String userName = extractUserName(token);
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaims(token, Claims::getExpiration);
    }
}
