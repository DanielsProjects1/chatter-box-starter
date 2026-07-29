package com.DanielsProjects1.Chatter_Box_Starter.service;

import com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs.RegisterUserRequest;
import org.springframework.stereotype.Service;

import com.DanielsProjects1.Chatter_Box_Starter.exception.RegistrationException;
import jakarta.ws.rs.WebApplicationException;
import jakarta.ws.rs.core.Response;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class KeycloakAdminService {

    private final Keycloak keycloak;
    private final String realm;

    public KeycloakAdminService(
            Keycloak keycloak,
            @Value("${keycloak.admin.realm}")
            String realm
    ) {
        this.keycloak = keycloak;
        this.realm = realm;
    }

    public UUID createUser(RegisterUserRequest request) {
        UsersResource users = keycloak.realm(realm).users();
        UserRepresentation representation = new UserRepresentation();

        representation.setEnabled(true);
        representation.setUsername(request.username());
        representation.setEmail(request.email());
        representation.setEmailVerified(true);

        if (request.displayName() != null) {
            representation.setFirstName(
                    request.displayName()
            );
        }

        CredentialRepresentation password = new CredentialRepresentation();
        password.setType(CredentialRepresentation.PASSWORD);
        password.setValue(request.password());
        password.setTemporary(false);

        representation.setCredentials(
                List.of(password)
        );

        try (Response response = users.create(representation)) {
            if (response.getStatus() == 409) {
                throw new RegistrationException(
                        "A user with that username or email already exists"
                );
            }

            if (response.getStatus() != 201) {
                String body = response.hasEntity()
                        ? response.readEntity(String.class)
                        : "";

                throw new RegistrationException(
                        "Keycloak rejected user creation. Status: "
                                + response.getStatus()
                                + ", response: "
                                + body
                );
            }

            String createdId = CreatedResponseUtil.getCreatedId(response);

            return UUID.fromString(createdId);

        } catch (WebApplicationException exception) {
            throw new RegistrationException(
                    "Unable to create identity in Keycloak",
                    exception
            );
        }
    }

    public void deleteUser(UUID userId) {
        try {
            keycloak.realm(realm)
                    .users()
                    .delete(userId.toString());
        } catch (RuntimeException exception) {
            System.err.println(
                    "Failed to compensate by deleting Keycloak user: " + userId
            );
        }
    }
}
