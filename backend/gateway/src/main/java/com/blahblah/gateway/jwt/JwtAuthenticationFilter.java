package com.blahblah.gateway.jwt;

import com.blahblah.gateway.exception.JwtAuthenticationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.GatewayFilterFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;


@Component
@Slf4j
public class JwtAuthenticationFilter implements GatewayFilterFactory<JwtAuthenticationFilter.Config> {

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {

            ServerHttpRequest request = exchange.getRequest();
            log.info(request.getPath().toString());

            if(!request.getHeaders().containsKey("Authorization"))
                throw new JwtAuthenticationException("권한 없는 사용자입니다", HttpStatus.FORBIDDEN);

            String accessToken = request.getHeaders().get("Authorization").get(0).substring(7);

            if(!JwtUtil.isValidToken(accessToken))
                throw new JwtAuthenticationException("권한 없는 사용자입니다", HttpStatus.FORBIDDEN);

            return chain.filter(exchange);
        };
    }

    @Override
    public Class<Config> getConfigClass() {
        return Config.class;
    }

    public static class Config {
        // Put the configuration properties
    }
}