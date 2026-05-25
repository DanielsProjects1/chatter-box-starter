package com.DanielsProjects1.Chatter_Box_Starter.dto;

import com.DanielsProjects1.Chatter_Box_Starter.entities.Site;
import lombok.Data;

import java.util.UUID;
@Data
public class SiteDTO {
    private UUID id;
    private String domain;
    private UUID ownerId;

    public static SiteDTO from(Site site) {
        SiteDTO dto = new SiteDTO();
        dto.id = site.getId();
        dto.domain = site.getDomain();
        dto.ownerId = site.getOwner().getId();
        return dto;
    }
}
