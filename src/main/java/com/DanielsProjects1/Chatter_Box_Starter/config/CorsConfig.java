package com.DanielsProjects1.Chatter_Box_Starter.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        CorsConfiguration widgetCors = new CorsConfiguration();

        // Embeddable widget may run on customer websites.
        widgetCors.setAllowedOriginPatterns(List.of("*"));

        widgetCors.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PATCH",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));

        widgetCors.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin"
        ));

        widgetCors.setExposedHeaders(List.of(
                "Retry-After",
                "X-RateLimit-Limit",
                "X-RateLimit-Remaining"
        ));

        // You use Bearer tokens, not cross-origin cookies.
        widgetCors.setAllowCredentials(false);
        widgetCors.setMaxAge(3600L);

        CorsConfiguration dashboardCors = new CorsConfiguration();

        // Only your own frontend applications should call dashboard routes.
        dashboardCors.setAllowedOrigins(List.of(
                "http://localhost:3000",
                "http://127.0.0.1:3000"
                // Add production dashboard origin later.
        ));

        dashboardCors.setAllowedMethods(List.of(
                "GET",
                "POST",
                "PATCH",
                "PUT",
                "DELETE",
                "OPTIONS"
        ));

        dashboardCors.setAllowedHeaders(List.of(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin"
        ));

        dashboardCors.setExposedHeaders(List.of(
                "Retry-After",
                "X-RateLimit-Limit",
                "X-RateLimit-Remaining"
        ));

        dashboardCors.setAllowCredentials(false);
        dashboardCors.setMaxAge(3600L);

        source.registerCorsConfiguration(
                "/api/v1/widget/**",
                widgetCors
        );

        source.registerCorsConfiguration(
                "/api/v1/dashboard/**",
                dashboardCors
        );

        CorsConfiguration authCors = new CorsConfiguration();

        authCors.setAllowedOriginPatterns(List.of("*"));
        authCors.setAllowedMethods(List.of(
                "POST",
                "OPTIONS"
        ));
        authCors.setAllowedHeaders(List.of(
                "Content-Type",
                "Accept",
                "Origin"
        ));
        authCors.setAllowCredentials(false);
        authCors.setMaxAge(3600L);

        source.registerCorsConfiguration(
                "/api/v1/auth/**",
                authCors
        );

        return source;
    }
}
