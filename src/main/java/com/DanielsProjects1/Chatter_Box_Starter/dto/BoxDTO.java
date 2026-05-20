package com.DanielsProjects1.Chatter_Box_Starter.dto;

import com.DanielsProjects1.Chatter_Box_Starter.entities.Box;

import java.util.UUID;

public class BoxDTO {
    private UUID id;
    private UUID siteId;
    private String pageUrl;
    private boolean locked;
    private boolean active;

    public static BoxDTO from(Box box) {
        BoxDTO dto = new BoxDTO();
        dto.id = box.getId();
        dto.siteId = box.getSite().getId();
        dto.pageUrl = box.getPageUrl();
        dto.locked = box.isLocked();
        dto.active = box.isActive();
        return dto;
    }
}
