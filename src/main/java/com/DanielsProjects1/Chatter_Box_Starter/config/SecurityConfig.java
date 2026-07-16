package com.DanielsProjects1.Chatter_Box_Starter.config;

import com.DanielsProjects1.Chatter_Box_Starter.filter.RateLimitFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            RateLimitFilter rateLimitFilter
    ) throws Exception {
        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/actuator/health").permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/v1/widget/init").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/widget/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/dashboard/sites/*/rules").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/widget/gifs/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/widget/boxes/*").authenticated()
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(Customizer.withDefaults())
                )
                .addFilterAfter(rateLimitFilter, BearerTokenAuthenticationFilter.class);
        return http.build();
    }
}
