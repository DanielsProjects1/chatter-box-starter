package com.DanielsProjects1.Chatter_Box_Starter.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestResolver;
import org.springframework.security.oauth2.core.endpoint.OAuth2AuthorizationRequest;

public class ChatterBoxAuthorizationRequestResolver implements OAuth2AuthorizationRequestResolver {
    private static final String REGISTRATION_REQUEST_ATTRIBUTE = "CHATTERBOX_REGISTRATION_REQUEST";

    private final DefaultOAuth2AuthorizationRequestResolver delegate;

    public ChatterBoxAuthorizationRequestResolver(
            ClientRegistrationRepository clientRegistrationRepository
    ) {
        this.delegate =
                new DefaultOAuth2AuthorizationRequestResolver(
                        clientRegistrationRepository,
                        "/oauth2/authorization"
                );
    }
    @Override
    public OAuth2AuthorizationRequest resolve(
            HttpServletRequest request
    ) {
        return customize(
                request,
                delegate.resolve(request)
        );
    }
    @Override
    public OAuth2AuthorizationRequest resolve(
            HttpServletRequest request,
            String clientRegistrationId
    ) {
        return customize(
                request,
                delegate.resolve(
                        request,
                        clientRegistrationId
                )
        );
    }
    private OAuth2AuthorizationRequest customize(
            HttpServletRequest request,
            OAuth2AuthorizationRequest authorizationRequest
    ) {
        if (authorizationRequest == null) {
            return null;
        }

        HttpSession session = request.getSession(false);

        boolean registrationRequested =
                session != null
                        && Boolean.TRUE.equals(
                        session.getAttribute(
                                REGISTRATION_REQUEST_ATTRIBUTE
                        )
                );

        if (!registrationRequested) {
            return authorizationRequest;
        }

        session.removeAttribute(
                REGISTRATION_REQUEST_ATTRIBUTE
        );

        return OAuth2AuthorizationRequest
                .from(authorizationRequest)
                .additionalParameters(parameters ->
                        parameters.put(
                                "prompt",
                                "create"
                        )
                )
                .build();
    }
}