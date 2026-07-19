package com.DanielsProjects1.Chatter_Box_Starter.dto;

import com.DanielsProjects1.Chatter_Box_Starter.entities.Site;
import lombok.Data;

import java.util.UUID;
@Data
public class SiteDTO {
    private UUID id;
    private String domain;

    public static SiteDTO from(Site site) {
        SiteDTO dto = new SiteDTO();
        dto.id = site.getId();
        dto.domain = site.getDomain();
        return dto;
    }
}
