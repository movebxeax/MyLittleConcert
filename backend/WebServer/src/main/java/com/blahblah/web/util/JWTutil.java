package com.blahblah.web.util;


import com.blahblah.web.controller.exception.JwtAuthenticationException;
import com.blahblah.web.dto.response.UserDTO;
import com.blahblah.web.entity.UserEntity;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import java.security.Key;
import java.util.ArrayList;
import java.util.Date;

@Component
@Slf4j
public class JWTutil {
    private static Key SECRET_KEY;
    private static long ACCESS_EXPIRATION_TIME;
    private static long REFRESH_EXPIRATION_TIME;

    private static String ISSUER;


    @Autowired
    private JWTutil(@Value("${jwt.secret}") String secretKey,
                    @Value("${jwt.access_expiration}") long ecc_expirationTime,
                    @Value("${jwt.refresh_expiration}") long ref_expirationTime,
                    @Value("${jwt.issuer}") String issuer){
        SECRET_KEY = Keys.hmacShaKeyFor(secretKey.getBytes());
        ACCESS_EXPIRATION_TIME = ecc_expirationTime;
        REFRESH_EXPIRATION_TIME = ref_expirationTime;
        ISSUER = issuer;
    };
    public static String getJwtToken(UserDTO user){
        Date now = new Date();
        return Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)
                .setIssuer(ISSUER)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + ACCESS_EXPIRATION_TIME))
                .claim("id", user.getId())
                .claim("userId",user.getUserId())
                .claim("nickName",user.getNickName())
                .claim("avatar",user.getAvatar())
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    public static String getRefreshToken(UserDTO user){
        Date now = new Date();
        return Jwts.builder()
                .setHeaderParam(Header.TYPE, Header.JWT_TYPE)
                .setIssuer(ISSUER)
                .setIssuedAt(now)
                .setExpiration(new Date(now.getTime() + REFRESH_EXPIRATION_TIME))
                .claim("userId", user.getUserId())
                .signWith(SECRET_KEY, SignatureAlgorithm.HS256)
                .compact();
    }

    // JWT ????????? ??????????????? ????????? ???????????? ????????? ????????? ?????????
    public static Authentication getAuthentication(String accessToken) {
        // ?????? ?????????
        Claims claims = parseClaims(accessToken);

        String userId = (String)claims.get("userId");

        log.info("USER_ID : " + userId);

        if (userId == null) {
            throw new RuntimeException("?????? ????????? ?????? ???????????????.");
        }
        // UserDetails ????????? ???????????? Authentication ??????
        UserDTO principal = UserEntity.builder().userId(userId).build().toUserDTO();
        return new UsernamePasswordAuthenticationToken(principal, "", new ArrayList<>());
    }

    public static String  getIdByRefreshToken(String refreshToken){
        return (String) parseClaims(refreshToken).get("userId");
    }

    public static String  getIdByAccessToken(String accessToken){
        return (String) parseClaims(accessToken).get("userId");
    }

    public static Long  getLongIdByAccessToken(HttpServletRequest request){
        String accessToken =request.getHeader("Authorization").substring(7);
        return ((Integer)parseClaims(accessToken).get("id")).longValue();
    }

    public static boolean isValidToken(String token){
        try {
            Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(token);
            return true;
        } catch (io.jsonwebtoken.security.SecurityException | MalformedJwtException e) {
            log.info("Invalid JWT Token", e);
            throw new JwtAuthenticationException("???????????? ?????? ???????????????.", HttpStatus.UNAUTHORIZED);
        } catch (ExpiredJwtException e) {
            log.info("Expired JWT Token", e);
            throw new JwtAuthenticationException("????????? ???????????????.", HttpStatus.REQUEST_TIMEOUT);
        } catch (UnsupportedJwtException e) {
            log.info("Unsupported JWT Token", e);
            throw new JwtAuthenticationException("???????????? ?????? ???????????????.",HttpStatus.FORBIDDEN);
        } catch (IllegalArgumentException e) {
            log.info("JWT claims string is empty.", e);
            throw new JwtAuthenticationException("????????? ???????????? ??????????????????",HttpStatus.PRECONDITION_FAILED);
        }
    }

    public static Claims parseClaims(String accessToken) {
        try {
            return Jwts.parserBuilder().setSigningKey(SECRET_KEY).build().parseClaimsJws(accessToken).getBody();
        } catch (ExpiredJwtException e) {
            return e.getClaims();
        }
    }
}
