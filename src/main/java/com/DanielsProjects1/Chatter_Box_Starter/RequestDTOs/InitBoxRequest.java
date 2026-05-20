package com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs;

import lombok.Data;

import java.util.UUID;

@Data
public class InitBoxRequest {
    private UUID siteId;
    private String pageUrl;
}
