package com.DanielsProjects1.Chatter_Box_Starter.dto;

import com.DanielsProjects1.Chatter_Box_Starter.entities.SiteRule;
import lombok.Data;

@Data
public class SiteRuleDTO {
    private String rule;

    public static SiteRuleDTO from(SiteRule siteRule) {
        SiteRuleDTO dto = new SiteRuleDTO();
        dto.rule = siteRule.getRule();
        return dto;
    }
}
