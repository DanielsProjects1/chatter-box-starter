package com.DanielsProjects1.Chatter_Box_Starter.ResponseDTOs;

public record AuthUserResponse(
        boolean authenticated,
        UserDetails user
) {
    public record UserDetails(
            String subject,
            String username,
            String displayName,
            String email,
            boolean emailVerified
    ) {}

    public static AuthUserResponse anonymous() {
        return new AuthUserResponse(false, null);
    }

    public static AuthUserResponse authenticated(UserDetails user) {
        return new AuthUserResponse(true, user);
    }
}
