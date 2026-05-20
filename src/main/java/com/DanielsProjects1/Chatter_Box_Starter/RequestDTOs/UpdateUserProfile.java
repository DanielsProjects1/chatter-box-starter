package com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs;

import lombok.Data;

@Data
public class UpdateUserProfile {
    private String username;
    private String bio;
    private String pfpUrl;
    private String displayName;
}
