package com.DanielsProjects1.Chatter_Box_Starter.security;

import com.DanielsProjects1.Chatter_Box_Starter.controller.AuthFlowController;
import com.DanielsProjects1.Chatter_Box_Starter.service.UserService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
public class ChatterBoxAuthenticationSuccessHandler implements AuthenticationSuccessHandler {
    private final String frontendUrl;
    private final UserService userService;

    public ChatterBoxAuthenticationSuccessHandler(
            @Value("${chatterbox.frontend-url}")
            String frontendUrl,
            UserService userService
    ) {
        this.frontendUrl = removeTrailingSlash(frontendUrl);
        this.userService = userService;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {

        if (!(authentication.getPrincipal() instanceof OidcUser oidcUser)) { // checks type and creates oidcUser variable in one statement
            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Expected an OpenID Connect user"
            );
            return;
        }

        UUID keycloakId = UUID.fromString(oidcUser.getSubject());

        userService.syncUser(
                keycloakId,
                oidcUser.getEmail(),
                oidcUser.getPreferredUsername()
        );

        HttpSession session = request.getSession(false);

        String returnTo = "/dashboard";

        if (session != null) {
            Object storedReturnTo = session.getAttribute(
                    AuthFlowController.getReturnToSessionAttribute()
            );

            if (storedReturnTo instanceof String storedPath
                    && !storedPath.isBlank()) {
                returnTo = storedPath;
            }

            session.removeAttribute(
                    AuthFlowController.getReturnToSessionAttribute()
            );
        }

        response.sendRedirect(frontendUrl + returnTo);
    }

    private static String removeTrailingSlash(String value) {
        if (value.endsWith("/")) {
            return value.substring(0, value.length() - 1);
        }
        return value;
    }
}
