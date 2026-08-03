package com.DanielsProjects1.Chatter_Box_Starter.config;

import com.DanielsProjects1.Chatter_Box_Starter.filter.RateLimitFilter;
import com.DanielsProjects1.Chatter_Box_Starter.security.ChatterBoxAuthenticationSuccessHandler;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import jakarta.servlet.DispatcherType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.authentication.logout.HttpStatusReturningLogoutSuccessHandler;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import java.time.Duration;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            RateLimitFilter rateLimitFilter,
            ChatterBoxAuthenticationSuccessHandler successHandler
    ) throws Exception {
        http
                .cors(cors -> {})
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
                ) // Tells Spring "Create a session only when auth actually requires one".
                .authorizeHttpRequests(auth -> auth
                        .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(
                                "/api/v1/auth/login",
                                "/api/v1/auth/register",
                                "/api/v1/auth/me",
                                "/oauth2/**",
                                "/login/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.POST,"/api/v1/widget/init").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/widget/boxes/**").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/widget/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/dashboard/sites/*/rules").permitAll()
                        //.requestMatchers(HttpMethod.GET, "/api/v1/widget/gifs/search").permitAll()
                        .requestMatchers("/actuator/health").permitAll()
                        .anyRequest().authenticated()
                )
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(successHandler)
                )
                .logout(logout -> logout
                        .logoutUrl("/api/v1/auth/logout")
                        .invalidateHttpSession(true)
                        .clearAuthentication(true)
                        .deleteCookies(
                                "CHATTERBOX_SESSION",
                                "JSESSIONID"
                        )
                        .logoutSuccessHandler(
                                new HttpStatusReturningLogoutSuccessHandler(
                                        HttpStatus.NO_CONTENT
                                )
                        )
                )
                .addFilterAfter(rateLimitFilter, BearerTokenAuthenticationFilter.class);
        return http.build();
    }

//    @Bean
//    public JwtDecoder jwtDecoder(
//            @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
//            String jwkSetUri
//    ) {
//        SimpleClientHttpRequestFactory requestFactory =
//                new SimpleClientHttpRequestFactory();
//
//        requestFactory.setConnectTimeout(Duration.ofSeconds(5));
//        requestFactory.setReadTimeout(Duration.ofSeconds(15));
//
//        RestTemplate restTemplate = new RestTemplate(requestFactory);
//
//        return NimbusJwtDecoder
//                .withJwkSetUri(jwkSetUri)
//                .restOperations(restTemplate)
//                .build();
//    }
}
