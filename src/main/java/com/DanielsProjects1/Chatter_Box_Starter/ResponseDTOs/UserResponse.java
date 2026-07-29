package com.DanielsProjects1.Chatter_Box_Starter.ResponseDTOs;

import com.DanielsProjects1.Chatter_Box_Starter.entities.User;
import lombok.Data;

import java.util.UUID;

@Data
public class UserResponse {
    private UUID userId;
    private String username;
    private String displayName;
    private String bio;
    private String profilePictureUrl;

    public static UserResponse from(User user) {
        UserResponse dto = new UserResponse();
        dto.userId = user.getId();
        dto.username = user.getUsername();
        dto.displayName = user.getDisplayName();
        dto.bio = user.getBio();
        dto.profilePictureUrl = user.getProfilePictureUrl();
        return dto;
    }
}
