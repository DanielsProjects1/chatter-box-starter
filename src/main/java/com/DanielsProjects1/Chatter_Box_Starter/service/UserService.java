package com.DanielsProjects1.Chatter_Box_Starter.service;

import com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs.UpdateUserProfileRequest;
import com.DanielsProjects1.Chatter_Box_Starter.ResponseDTOs.UserResponse;
import com.DanielsProjects1.Chatter_Box_Starter.entities.User;
import com.DanielsProjects1.Chatter_Box_Starter.exception.RegistrationException;
import com.DanielsProjects1.Chatter_Box_Starter.exception.UserNotFoundException;
import com.DanielsProjects1.Chatter_Box_Starter.exception.UsernameAlreadyExistsException;
import com.DanielsProjects1.Chatter_Box_Starter.repo.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Locale;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class UserService {

    private static final Pattern USERNAME_PATTERN =
            Pattern.compile("^[a-z0-9_]+$");
    private final UserRepository userRepo;

    public UserService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

//    @Transactional
//    public User syncUser(UUID keycloakId, String email, String username) {
//        return userRepo.findById(keycloakId)
//                .orElseGet(() -> {
//                    User user = new User();
//                    user.setId(keycloakId);
//                    user.setEmail(email);
//                    user.setUsername(username);
//                    user.setDisplayName(username);
//                    return userRepo.saveAndFlush(user);
//                });
//    }
    @Transactional
    public User syncUser(UUID keycloakId, String email, String username) {
        User user = userRepo.findById(keycloakId)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setId(keycloakId);
                    return newUser;
                });
        user.setEmail(email);
        user.setUsername(username);
        if (user.getDisplayName() == null) {
            user.setDisplayName(username);
        }
        user.setActive(true);
        return userRepo.save(user);
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(UUID userId) {
        return toResponse(findUser(userId));
    }

    @Transactional
    public UserResponse updateProfile(
            UUID userId,
            UpdateUserProfileRequest request
    ) {
        if (request == null) {
            throw new RegistrationException(
                    "Profile update request is required"
            );
        }

        User user = findUser(userId);

        if (request.username() != null) {
            String username =
                    validateUsername(request.username());

            if (!username.equalsIgnoreCase(user.getUsername())) {
                boolean taken = userRepo.existsByUsernameIgnoreCaseAndIdNot(
                                        username,
                                        userId
                                );

                if (taken) {
                    throw new UsernameAlreadyExistsException(
                            username
                    );
                }

                user.setUsername(username);
            }
        }

        if (request.displayName() != null) {
            String displayName = normalizeOptional(request.displayName());

            if (displayName != null && displayName.length() > 50) {
                throw new RegistrationException("Display name must not exceed 50 characters");
            }

            user.setDisplayName(displayName);
        }

        if (request.bio() != null) {
            String bio = normalizeOptional(request.bio());

            if (bio != null && bio.length() > 500) {
                throw new RegistrationException("Bio must not exceed 500 characters");
            }

            user.setBio(bio);
        }

        if (request.pfpUrl() != null) {
            String profilePictureUrl = normalizeOptional(request.pfpUrl());

            if (profilePictureUrl != null
                    && profilePictureUrl.length() > 2048) {
                throw new RegistrationException(
                        "Profile picture URL is too long"
                );
            }

            user.setProfilePictureUrl(profilePictureUrl);
        }

        return toResponse(user);
    }

    private String validateUsername(String rawUsername) {
        String username = rawUsername.trim()
                        .toLowerCase(Locale.ROOT);

        if (username.length() < 3 || username.length() > 30) {
            throw new RegistrationException(
                    "Username must be between 3 and 30 characters"
            );
        }

        if (!USERNAME_PATTERN
                .matcher(username)
                .matches()) {
            throw new RegistrationException(
                    "Username may contain only lowercase letters, numbers, and underscores"
            );
        }

        return username;
    }

    private User findUser(UUID userId) {
        return userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
    }

    private UserResponse toResponse(User user) {
        return UserResponse.from(user);
    }

    private String normalizeOptional(String value) {
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
