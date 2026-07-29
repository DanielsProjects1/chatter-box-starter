package com.DanielsProjects1.Chatter_Box_Starter.service;

import com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs.RegisterUserRequest;
import com.DanielsProjects1.Chatter_Box_Starter.ResponseDTOs.UserResponse;
import com.DanielsProjects1.Chatter_Box_Starter.entities.User;
import com.DanielsProjects1.Chatter_Box_Starter.exception.RegistrationException;
import com.DanielsProjects1.Chatter_Box_Starter.exception.UsernameAlreadyExistsException;
import com.DanielsProjects1.Chatter_Box_Starter.repo.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class RegistrationService {

    private static final Pattern EMAIL_PATTERN =
            Pattern.compile(
                    "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
            );
    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[a-z0-9_]+$");
    private final UserRepository userRepo;
    private final KeycloakAdminService keycloakAdminService;

    public RegistrationService(
            UserRepository userRepo,
            KeycloakAdminService keycloakAdminService
    ) {
        this.userRepo = userRepo;
        this.keycloakAdminService = keycloakAdminService;
    }

    public UserResponse register(RegisterUserRequest request) {
        ValidatedRegistration validated = validateAndNormalize(request);

        if (userRepo.existsByUsernameIgnoreCase(validated.username())) {
            throw new UsernameAlreadyExistsException(
                    validated.username()
            );
        }

        RegisterUserRequest normalizedRequest = new RegisterUserRequest(
                        validated.email(),
                        validated.password(),
                        validated.username(),
                        validated.displayName()
                );

        UUID keycloakUserId = null;

        try {
            keycloakUserId = keycloakAdminService.createUser(normalizedRequest);

            User user = new User();

            user.setId(keycloakUserId);
            user.setUsername(validated.username());
            user.setDisplayName(validated.displayName());
            user.setBio(null);
            user.setProfilePictureUrl(null);

            User savedUser = userRepo.saveAndFlush(user);

            return toResponse(savedUser);

        } catch (DataIntegrityViolationException exception) {
            compensate(keycloakUserId);

            throw new RegistrationException(
                    "The username or account already exists",
                    exception
            );

        } catch (RuntimeException exception) {
            compensate(keycloakUserId);
            throw exception;
        }
    }

    private ValidatedRegistration validateAndNormalize(
            RegisterUserRequest request
    ) {
        if (request == null) {
            throw new RegistrationException("Registration request is required");
        }

        String email = normalizeEmail(request.email());
        String username = normalizeUsername(request.username());
        String password = request.password();
        String displayName = normalizeOptional(request.displayName());

        if (email == null) {
            throw new RegistrationException(
                    "Email is required"
            );
        }

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new RegistrationException(
                    "Email format is invalid"
            );
        }

        if (email.length() > 254) {
            throw new RegistrationException(
                    "Email must not exceed 254 characters"
            );
        }

        if (username == null) {
            throw new RegistrationException(
                    "Username is required"
            );
        }

        if (username.length() < 3 || username.length() > 50) {
            throw new RegistrationException(
                    "Username must be between 3 and 50 characters"
            );
        }

        if (!USERNAME_PATTERN
                .matcher(username)
                .matches()) {
            throw new RegistrationException(
                    "Username may contain only lowercase letters, numbers, and underscores"
            );
        }

        if (password == null || password.isBlank()) {
            throw new RegistrationException(
                    "Password is required"
            );
        }

        if (password.length() < 8 || password.length() > 128) {
            throw new RegistrationException(
                    "Password must be between 8 and 128 characters"
            );
        }

        if (displayName != null && displayName.length() > 50) {
            throw new RegistrationException(
                    "Display name must not exceed 50 characters"
            );
        }

        return new ValidatedRegistration(
                email,
                password,
                username,
                displayName
        );
    }

    private void compensate(UUID keycloakUserId) {
        if (keycloakUserId != null) {
            keycloakAdminService.deleteUser(keycloakUserId);
        }
    }

    private UserResponse toResponse(User user) {
        return UserResponse.from(user);
    }

    private String normalizeEmail(String email) {
        String normalized = normalizeRequired(email);
        return normalized == null
                ? null
                : normalized.toLowerCase(Locale.ROOT);
    }

    private String normalizeUsername(String username) {
        String normalized = normalizeRequired(username);
        return normalized == null
                ? null
                : normalized.toLowerCase(Locale.ROOT);
    }

    private String normalizeRequired(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String normalizeOptional(String value) {
        return normalizeRequired(value);
    }

    private record ValidatedRegistration(
            String email,
            String password,
            String username,
            String displayName
    ) {
    }
}
