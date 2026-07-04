package com.DanielsProjects1.Chatter_Box_Starter.dto;

import com.DanielsProjects1.Chatter_Box_Starter.entities.Box;
import com.DanielsProjects1.Chatter_Box_Starter.utils.CachedBox;
import lombok.Data;

import java.util.UUID;

@Data
public class BoxDTO {
    private UUID id;
    private UUID siteId;
    private String pageUrl;
    private boolean locked;
    private boolean active;
    private BoxPermissions permissions;

    public static BoxDTO from(Box box, BoxPermissions permissions) {
        BoxDTO dto = new BoxDTO();
        dto.id = box.getId();
        dto.siteId = box.getSite().getId();
        dto.pageUrl = box.getPageUrl();
        dto.locked = box.isLocked();
        dto.active = box.isActive();
        dto.permissions = permissions;
        return dto;
    }

    public static BoxDTO fromCached(
            CachedBox box,
            BoxPermissions permissions
    ) {
        BoxDTO dto = new BoxDTO();
        dto.setId(box.id());
        dto.setSiteId(box.siteId());
        dto.setPageUrl(box.pageUrl());
        dto.setLocked(box.locked());
        dto.setActive(box.active());
        dto.setPermissions(permissions);
        return dto;
    }
}
