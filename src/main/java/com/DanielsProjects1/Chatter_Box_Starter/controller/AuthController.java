package com.DanielsProjects1.Chatter_Box_Starter.controller;

import com.DanielsProjects1.Chatter_Box_Starter.ResponseDTOs.AuthUserResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    @GetMapping("/me")
    public ResponseEntity<AuthUserResponse> me(
            Authentication authentication
    ) {
        if (authentication == null
        || !authentication .isAuthenticated()
        || !(authentication.getPrincipal() instanceof OidcUser oidcUser)) {
            return ResponseEntity.ok(AuthUserResponse.anonymous());
        }
        String username = firstNonBlank(
                oidcUser.getPreferredUsername(),
                oidcUser.getEmail(),
                oidcUser.getSubject()
        );
        String displayName = firstNonBlank(
                oidcUser.getFullName(),
                oidcUser.getGivenName(),
                username
        );
        Boolean verifiedClaim = oidcUser.getEmailVerified();

        AuthUserResponse.UserDetails user = new AuthUserResponse.UserDetails(
                oidcUser.getSubject(),
                username,
                displayName,
                oidcUser.getEmail(),
                Boolean.TRUE.equals(verifiedClaim)
        );
        return ResponseEntity.ok(
                AuthUserResponse.authenticated(user)
        );
    }

    private String firstNonBlank(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) return value;
        }

        return "ChatterBox User";
    }
}
