package com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs;

public record UpdateUserProfileRequest(
       String username,
       String displayName,
       String pfpUrl,
       String bio
) {}
