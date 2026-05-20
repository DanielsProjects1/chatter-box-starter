package com.DanielsProjects1.Chatter_Box_Starter.controller;

import com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs.CreateSiteRule;
import com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs.RegisterSiteRequest;
import com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs.UpdateSiteDomain;
import com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs.UpdateSiteMemberRole;
import com.DanielsProjects1.Chatter_Box_Starter.dto.SiteDTO;
import com.DanielsProjects1.Chatter_Box_Starter.dto.SiteMemberDTO;
import com.DanielsProjects1.Chatter_Box_Starter.dto.SiteRuleDTO;
import com.DanielsProjects1.Chatter_Box_Starter.dto.UserDTO;
import com.DanielsProjects1.Chatter_Box_Starter.entities.Site;
import com.DanielsProjects1.Chatter_Box_Starter.entities.SiteRule;
import com.DanielsProjects1.Chatter_Box_Starter.service.BoxService;
import com.DanielsProjects1.Chatter_Box_Starter.service.SiteService;
import com.DanielsProjects1.Chatter_Box_Starter.utils.SecurityUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/dashboard/sites")
public class SiteDashboardController {

    private SiteService siteService;
    private BoxService boxService;

    public SiteDashboardController(SiteService siteService, BoxService boxService) {
        this.siteService = siteService;
        this.boxService = boxService;
    }

    @PostMapping
    public ResponseEntity<SiteDTO> registerSite(@RequestBody RegisterSiteRequest request, Authentication authentication) {
        UUID userId = SecurityUtils.getUserId(authentication);
        Site site = siteService.registerSite(request.getDomain(), userId);
        return ResponseEntity.status(201).body(SiteDTO.from(site));
    }

    @PutMapping("/{siteId}")
    public ResponseEntity<Void> updateDomain(
            @PathVariable UUID siteId,
            @RequestBody UpdateSiteDomain newDomain,
            Authentication authentication
    ) throws AccessDeniedException {
        siteService.updateSiteDomain(siteId, SecurityUtils.getUserId(authentication), newDomain.getDomain());
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{siteId}")
    public ResponseEntity<Void> deactivateSite(
            @PathVariable UUID siteId,
            Authentication authentication
    ) throws AccessDeniedException {
        siteService.deactivateSite(siteId, SecurityUtils.getUserId(authentication));
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<SiteDTO>> getAllSites(Authentication authentication) {
        List<SiteDTO> sites = siteService.getSitesRegisteredByOwner(SecurityUtils.getUserId(authentication))
                .stream()
                .map(SiteDTO::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(sites);
    }

    @PostMapping("/{siteId}/rules")
    public ResponseEntity<SiteRuleDTO> addSiteRule(
            @PathVariable UUID siteId,
            @RequestBody CreateSiteRule newRule,
           Authentication authentication
    ) throws AccessDeniedException {
        SiteRule rule = siteService.createSiteRule(siteId, SecurityUtils.getUserId(authentication), newRule.getRule());
        return ResponseEntity.status(201).body(SiteRuleDTO.from(rule));
    }

    @DeleteMapping("/{siteId}/rules/{ruleId}")
    public ResponseEntity<Void> deleteSiteRule(
            @PathVariable UUID siteId,
            @PathVariable UUID ruleId,
            Authentication authentication
    ) throws AccessDeniedException {
        siteService.deleteSiteRule(siteId, SecurityUtils.getUserId(authentication), ruleId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{siteId}/rules")
    public ResponseEntity<List<SiteRuleDTO>> getSiteRules(
            @PathVariable UUID siteId
    ) {
        List<SiteRuleDTO> rules = siteService.getSiteRules(siteId)
                .stream()
                .map(SiteRuleDTO::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(rules);
    }

    @GetMapping("/{siteId}/members")
    public ResponseEntity<List<SiteMemberDTO>> getMembers(@PathVariable UUID siteId) {
        List<SiteMemberDTO> members = siteService.getSiteMembers(siteId)
                .stream()
                .map(SiteMemberDTO::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(members);
    }

    @PutMapping("/{siteId}/members/{memberId}/role")
    public ResponseEntity<Void> updateMemberRole(
            @PathVariable UUID siteId,
            @PathVariable UUID memberId,
            @RequestBody UpdateSiteMemberRole newMemberRole,
            Authentication authentication
    ) throws AccessDeniedException {
        siteService.updateMemberRole(siteId, SecurityUtils.getUserId(authentication), memberId, newMemberRole.getNewSiteRole());
        return ResponseEntity.noContent().build();
    }


}
