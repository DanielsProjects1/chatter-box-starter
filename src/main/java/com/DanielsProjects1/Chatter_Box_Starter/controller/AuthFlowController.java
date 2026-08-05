package com.DanielsProjects1.Chatter_Box_Starter.controller;

import com.DanielsProjects1.Chatter_Box_Starter.config.ChatterBoxAuthorizationRequestResolver;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Set;

@Controller
@RequestMapping("/api/v1/auth")
public class AuthFlowController {
    private static final String RETURN_TO_SESSION_ATTRIBUTE = "CHATTERBOX_RETURN_TO";
    private static final String KEYCLOAK_AUTHORIZATION_PATH = "/oauth2/authorization/keycloak";
    private static final Set<String> ALLOWED_RETURN_PATH_PREFIXES =
            Set.of(
                    "/",
                    "/dashboard",
                    "/sites",
                    "/settings",
                    "/billing",
                    "/account",
                    "/onboarding"
            );
    private static final String REGISTRATION_REQUEST_ATTRIBUTE = "CHATTERBOX_REGISTRATION_REQUEST";
    private final String frontendUrl;

    public AuthFlowController(
            @Value("${chatterbox.frontend-url}")
            String frontendUrl
    ) {
        this.frontendUrl = removeTrailingSlash(frontendUrl);
    }

    @GetMapping("/login")
    public void login(
            @RequestParam(
                    name = "returnTo",
                    defaultValue = "/dashboard"
            )
            String returnTo,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        storeSafeReturnTo(request, returnTo);
        response.sendRedirect(
                request.getContextPath()
                        + KEYCLOAK_AUTHORIZATION_PATH
        );
    }

    @GetMapping("/register")
    public void register(
            @RequestParam(
                    name = "returnTo",
                    defaultValue = "/onboarding"
            )
            String returnTo,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        storeSafeReturnTo(request, returnTo);
        request.getSession().setAttribute(
                ChatterBoxAuthorizationRequestResolver
                        .REGISTRATION_REQUEST_ATTRIBUTE,
                Boolean.TRUE
        );
        response.sendRedirect(
                request.getContextPath()
                        + KEYCLOAK_AUTHORIZATION_PATH
        );
    }

    private void storeSafeReturnTo(
            HttpServletRequest request,
            String requestedReturnTo
    ) {
        String safeReturnTo = normalizeReturnTo(requestedReturnTo);

        HttpSession session = request.getSession(true);
        session.setAttribute(
                RETURN_TO_SESSION_ATTRIBUTE,
                safeReturnTo
        );
    }

    private String normalizeReturnTo(String candidate) {
        if (candidate == null || candidate.isBlank()) {
            return "/dashboard";
        }

        String trimmed = candidate.trim();

        /*
         * Only relative application paths are accepted.
         *
         * Reject:
         * https://attacker.example
         * //attacker.example
         * javascript:...
         */
        if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
            return "/dashboard";
        }
        try {
            URI uri = new URI(trimmed);
            if (uri.isAbsolute() || uri.getHost() != null) {
                return "/dashboard";
            }
        } catch (URISyntaxException exception) {
            return "/dashboard";
        }

        boolean allowed = ALLOWED_RETURN_PATH_PREFIXES.stream()
                .anyMatch(path ->
                        path.equals("/")
                                ? trimmed.equals("/")
                                : trimmed.equals(path)
                                || trimmed.startsWith(path + "/")
                                || trimmed.startsWith(path + "?")
                );

        return allowed ? trimmed : "/dashboard";
    }

    private static String removeTrailingSlash(String value) {
        if (value.endsWith("/")) {
            return value.substring(0, value.length() - 1);
        }
        return value;
    }

    public static String getReturnToSessionAttribute() {
        return RETURN_TO_SESSION_ATTRIBUTE;
    }
}