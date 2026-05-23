package com.DanielsProjects1.Chatter_Box_Starter.service;

import com.DanielsProjects1.Chatter_Box_Starter.entities.GlobalRole;
import com.DanielsProjects1.Chatter_Box_Starter.entities.User;
import com.DanielsProjects1.Chatter_Box_Starter.repo.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.UUID;

@Service
public class UserService {

    private UserRepository userRepo;

    public UserService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public User getUserProfile(UUID userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("This user does not exist."));
        return user;
    }

    @Transactional
    public void updateUserProfile(UUID userId, String newUsername, String displayName, String pfpUrl, String bio) {
        User user = getUserProfile(userId);
        if (newUsername != null) user.setUsername(newUsername);
        if (displayName != null) user.setDisplayName(displayName);
        if (pfpUrl != null) user.setProfilePictureUrl(pfpUrl);
        if (bio != null) user.setBio(bio);
        userRepo.save(user);
    }

    @Transactional
    public void deactivateUser(UUID userId, UUID deactivatingUserId) throws AccessDeniedException {
        User deactivator = getUserProfile(deactivatingUserId);
        if (!userId.equals(deactivatingUserId) && deactivator.getGlobalRole() != GlobalRole.ADMIN) {
            throw new AccessDeniedException("You cannot deactivate an account that is not your own.");
        }
        User user = getUserProfile(userId);
        user.setActive(false);
        userRepo.save(user);
    }

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


}
