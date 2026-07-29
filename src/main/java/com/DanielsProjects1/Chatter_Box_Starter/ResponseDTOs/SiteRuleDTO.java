package com.DanielsProjects1.Chatter_Box_Starter.ResponseDTOs;

import com.DanielsProjects1.Chatter_Box_Starter.entities.SiteRule;
import lombok.Data;

@Data
public class SiteRuleDTO {
    private String rule;
    private String description;

    public static SiteRuleDTO from(SiteRule siteRule) {
        SiteRuleDTO dto = new SiteRuleDTO();
        dto.rule = siteRule.getRule();
        dto.description = siteRule.getDescription();
        return dto;
    }
}
