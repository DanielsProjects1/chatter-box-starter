package com.DanielsProjects1.Chatter_Box_Starter.dto;

import com.DanielsProjects1.Chatter_Box_Starter.entities.User;

import java.util.UUID;

public class UserDTO {
    private UUID userId;
    private String username;
    private String displayName;
    private String bio;
    private String profilePictureUrl;

    public static UserDTO from(User user) {
        UserDTO dto = new UserDTO();
        dto.userId = user.getId();
        dto.username = user.getUsername();
        dto.displayName = user.getDisplayName();
        dto.bio = user.getBio();
        dto.profilePictureUrl = user.getProfilePictureUrl();
        return dto;
    }
}
