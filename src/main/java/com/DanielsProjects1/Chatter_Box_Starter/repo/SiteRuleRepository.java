package com.DanielsProjects1.Chatter_Box_Starter.repo;

import com.DanielsProjects1.Chatter_Box_Starter.entities.SiteRule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SiteRuleRepository extends JpaRepository<SiteRule, UUID> {
    Optional<SiteRule> findByIdAndSiteId(UUID ruleId, UUID siteId);
    List<SiteRule> findAllBySiteId(UUID siteId);
    boolean existsBySiteIdAndRule(UUID siteId, String rule);
}
