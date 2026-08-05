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
import org.springframework.security.oauth2.client.oidc.web.logout.OidcClientInitiatedLogoutSuccessHandler;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.server.resource.web.authentication.BearerTokenAuthenticationFilter;
import org.springframework.security.web.SecurityFilterChain;
import jakarta.servlet.DispatcherType;
import org.springframework.security.web.authentication.logout.LogoutSuccessHandler;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            RateLimitFilter rateLimitFilter,
            ChatterBoxAuthenticationSuccessHandler successHandler,
            ClientRegistrationRepository clientRegistrationRepository
    ) throws Exception {
        var authorizationRequestResolver =
                new ChatterBoxAuthorizationRequestResolver(
                        clientRegistrationRepository
                );
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
                        .authorizationEndpoint(ep ->
                                ep.authorizationRequestResolver(
                                        authorizationRequestResolver
                                )
                        )
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
                                oidcLogoutSuccessHandler(
                                        clientRegistrationRepository
                                )
                        )
                )
                .addFilterAfter(rateLimitFilter, BearerTokenAuthenticationFilter.class);
        return http.build();
    }

    private LogoutSuccessHandler oidcLogoutSuccessHandler(
            ClientRegistrationRepository clientRegistrationRepository
    ) {
        OidcClientInitiatedLogoutSuccessHandler logoutSuccessHandler =
                new OidcClientInitiatedLogoutSuccessHandler(
                        clientRegistrationRepository
                );

        logoutSuccessHandler.setPostLogoutRedirectUri(
                "http://localhost:3000"
        );

        return logoutSuccessHandler;
    }
}
