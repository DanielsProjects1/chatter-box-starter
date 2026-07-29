package com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs;


public record RegisterUserRequest(
        String email,
        String password,
        String username,
        String displayName
) {}
