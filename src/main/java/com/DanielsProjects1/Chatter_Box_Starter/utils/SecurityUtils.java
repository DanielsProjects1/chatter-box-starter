package com.DanielsProjects1.Chatter_Box_Starter.utils;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.jwt.Jwt;

import java.util.Optional;
import java.util.UUID;

public class SecurityUtils {

    private SecurityUtils() {
        // Utility class: prevent instantiation.
    }

    public static UUID getUserId(
            Authentication authentication
    ) {
        return findUserId(authentication)
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Authenticated user ID is unavailable"
                        )
                );
    }

    public static Optional<UUID> findUserId(
            Authentication authentication
    ) {
        if (
                authentication == null ||
                        !authentication.isAuthenticated()
        ) {
            return Optional.empty();
        }

        Object principal = authentication.getPrincipal();

        if (
                principal == null ||
                        "anonymousUser".equals(principal)
        ) {
            return Optional.empty();
        }

        if (principal instanceof OidcUser oidcUser) {
            return Optional.of(
                    UUID.fromString(
                            oidcUser.getSubject()
                    )
            );
        }

        if (principal instanceof Jwt jwt) {
            return Optional.of(
                    UUID.fromString(
                            jwt.getSubject()
                    )
            );
        }

        return Optional.empty();
    }
}
