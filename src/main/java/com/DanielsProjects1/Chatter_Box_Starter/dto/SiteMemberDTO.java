package com.DanielsProjects1.Chatter_Box_Starter.dto;

import com.DanielsProjects1.Chatter_Box_Starter.entities.SiteMember;
import com.DanielsProjects1.Chatter_Box_Starter.entities.SiteRole;
import lombok.Data;

import java.util.UUID;

@Data
public class SiteMemberDTO {
    private UUID userId;
    private SiteRole siteRole;

    public static SiteMemberDTO from(SiteMember siteMember) {
        SiteMemberDTO dto = new SiteMemberDTO();
        dto.userId = siteMember.getUser().getId();
        dto.siteRole = siteMember.getRole();
        return dto;
    }
}
