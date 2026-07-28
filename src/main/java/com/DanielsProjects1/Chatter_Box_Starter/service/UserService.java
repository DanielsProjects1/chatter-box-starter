package com.DanielsProjects1.Chatter_Box_Starter.service;

import com.DanielsProjects1.Chatter_Box_Starter.dto.UserDTO;
import com.DanielsProjects1.Chatter_Box_Starter.entities.GlobalRole;
import com.DanielsProjects1.Chatter_Box_Starter.entities.User;
import com.DanielsProjects1.Chatter_Box_Starter.repo.UserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.file.AccessDeniedException;
import java.util.UUID;

@Service
public class UserService {

    private UserRepository userRepo;

    public UserService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public User getUserProfile(UUID userId) {
        return userRepo.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "This user does not exist."
                ));
    }

    @Transactional
    public User setUsername(UUID keycloakUserId, String rawUsername) {
        User user = userRepo.findById(keycloakUserId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Chatterbox user was not found"
                ));

        String username = normalizeAndValidateUsername(rawUsername);

        if (user.getUsername() != null && !user.getUsername().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Username has already been configured"
            );
        }

        if (userRepo.existsByUsernameIgnoreCase(username)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Username is already taken"
            );
        }

        user.setUsername(username);

        try {
            User savedUser = userRepo.save(user);
            return savedUser;
        } catch (DataIntegrityViolationException exception) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Username is already taken",
                    exception
            );
        }
    }

//    @Transactional
//    public void updateUserProfile(UUID userId, String newUsername, String displayName, String pfpUrl, String bio) {
//        User user = getUserProfile(userId);
//        if (newUsername != null) user.setUsername(newUsername);
//        if (displayName != null) user.setDisplayName(displayName);
//        if (pfpUrl != null) user.setProfilePictureUrl(pfpUrl);
//        if (bio != null) user.setBio(bio);
//        userRepo.save(user);
//    }

//    @Transactional
//    public void deactivateUser(UUID userId, UUID deactivatingUserId) throws AccessDeniedException {
//        User deactivator = getUserProfile(deactivatingUserId);
//        if (!userId.equals(deactivatingUserId) && deactivator.getGlobalRole() != GlobalRole.ADMIN) {
//            throw new AccessDeniedException("You cannot deactivate an account that is not your own.");
//        }
//        User user = getUserProfile(userId);
//        user.setActive(false);
//        userRepo.save(user);
//    }

    @Transactional
    public User syncUser(UUID keycloakId, String email, String username) {
        return userRepo.findById(keycloakId)
                .orElseGet(() -> {
                    User user = new User();
                    user.setId(keycloakId);
                    user.setEmail(email);
                    user.setUsername(username);
                    user.setDisplayName(username);
                    return userRepo.saveAndFlush(user);
                });
    }

    private String normalizeAndValidateUsername(String rawUsername) {
        if (rawUsername == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Username is null"
            );
        }
        String username = rawUsername.trim();

        if (username.isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Username is empty"
            );
        }

        if (username.length() < 3 || username.length() > 50) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Username must be between 3 and 50 characters"
            );
        }

        if (!username.matches("^[A-Za-z0-9_]+$")) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Username must onlycontain alphanumerica"
            );
        }
        return username;
    }
}
