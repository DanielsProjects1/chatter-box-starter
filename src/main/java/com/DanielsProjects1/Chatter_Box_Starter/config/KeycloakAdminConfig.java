package com.DanielsProjects1.Chatter_Box_Starter.config;

import org.keycloak.OAuth2Constants;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class KeycloakAdminConfig {

    @Bean
    public Keycloak keycloakAdminClient(
            @Value("${keycloak.admin.server-url}")
            String serverUrl,

            @Value("${keycloak.admin.realm}")
            String realm,

            @Value("${keycloak.admin.client-id}")
            String clientId,

            @Value("${keycloak.admin.client-secret}")
            String clientSecret
    ) {
        return KeycloakBuilder.builder()
                .serverUrl(serverUrl)
                .realm(realm)
                .grantType(OAuth2Constants.CLIENT_CREDENTIALS)
                .clientId(clientId)
                .clientSecret(clientSecret)
                .build();
    }
}
