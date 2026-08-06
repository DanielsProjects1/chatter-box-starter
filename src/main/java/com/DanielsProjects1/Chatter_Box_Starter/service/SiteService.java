package com.DanielsProjects1.Chatter_Box_Starter.service;

import com.DanielsProjects1.Chatter_Box_Starter.ResponseDTOs.InstallationStatusDTO;
import com.DanielsProjects1.Chatter_Box_Starter.entities.*;
import com.DanielsProjects1.Chatter_Box_Starter.repo.SiteMemberRepository;
import com.DanielsProjects1.Chatter_Box_Starter.repo.SiteRepository;
import com.DanielsProjects1.Chatter_Box_Starter.repo.SiteRuleRepository;
import com.DanielsProjects1.Chatter_Box_Starter.repo.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class SiteService {

    private SiteRepository siteRepo;
    private UserRepository userRepo;
    private SiteMemberRepository siteMemberRepo;
    private SiteRuleRepository siteRuleRepo;

    public SiteService(SiteRepository siteRepo, UserRepository userRepo, SiteMemberRepository siteMemberRepo, SiteRuleRepository siteRuleRepo) {
        this.siteRepo = siteRepo;
        this.userRepo = userRepo;
        this.siteMemberRepo = siteMemberRepo;
        this.siteRuleRepo = siteRuleRepo;
    }

    @Transactional
    public Site registerSite(String domain, UUID ownerId) {
        Optional<Site> existingSite = siteRepo.findByDomain(domain);
        if (existingSite.isPresent()) {
            throw new RuntimeException("Site already exists");
        }
        Site site = new Site();
        site.setDomain(domain);
        User user = userRepo.findById(ownerId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + ownerId));
        site.setOwner(user);
        siteRepo.save(site);
        SiteMember membership = new SiteMember();
        membership.setSite(site);
        membership.setUser(user);
        membership.setRole(SiteRole.OWNER);
        siteMemberRepo.save(membership);
        return site;
    }

    @Transactional
    public void deactivateSite(UUID siteId, UUID ownerId) throws AccessDeniedException {
        Site site = siteRepo.findById(siteId)
                .orElseThrow(() -> new RuntimeException("Site not found"));

        if (!site.getOwner().getId().equals(ownerId)) {
            throw new AccessDeniedException("You do not have permission to deactivate this site.");
        }
        site.setActive(false);
        siteRepo.save(site);
    }

    @Transactional
    public void updateMemberRole(UUID siteId, UUID ownerId, UUID userId, SiteRole role) throws AccessDeniedException {
        Site site = siteRepo.findById(siteId)
                .orElseThrow(() -> new RuntimeException("Site not found"));
        if (!site.getOwner().getId().equals(ownerId)) {
            throw new AccessDeniedException("You do not have permission to update this site.");
        }

        SiteMember member = siteMemberRepo.findByUserIdAndSiteId(userId, siteId)
                .orElseThrow(() -> new RuntimeException("No user on your website with the id: " + userId));

        if (role == SiteRole.OWNER) {
            throw new RuntimeException("You cannot assign anyone the OWNER role. There can only be one OWNER per site.");
        }
        member.setRole(role);
        siteMemberRepo.save(member);
    }

    @Transactional
    public SiteRule createSiteRule(UUID siteId, UUID ownerId, String rule, String description) throws AccessDeniedException {
        Site site = siteRepo.findById(siteId)
                .orElseThrow(() -> new RuntimeException("Site not found"));
        if (!site.getOwner().getId().equals(ownerId)) {
            throw new AccessDeniedException("You do not have permission to update this site.");
        }
        boolean exists = siteRuleRepo.existsBySiteIdAndRule(siteId, rule);
        if (exists) {
            throw new RuntimeException("Your site already has that rule.");
        }
        SiteRule siteRule = new SiteRule();
        siteRule.setRule(rule);
        siteRule.setSite(site);
        siteRule.setDescription(description);
        siteRuleRepo.save(siteRule);
        return siteRule;
    }

    @Transactional
    public void deleteSiteRule(UUID siteId, UUID ownerId, UUID ruleId) throws AccessDeniedException {
        Site site = siteRepo.findById(siteId)
                .orElseThrow(() -> new RuntimeException("Site not found"));
        if (!site.getOwner().getId().equals(ownerId)) {
            throw new AccessDeniedException("You do not have permission to update this site.");
        }
        SiteRule rule = siteRuleRepo.findByIdAndSiteId(ruleId, siteId)
                .orElseThrow(() -> new RuntimeException("No rule on your site with the id: " + ruleId));
        siteRuleRepo.delete(rule);
    }

    public List<Site> getSitesRegisteredByOwner(UUID userId) {
        List<Site> sites = siteRepo.findAllByOwnerId(userId);
        return sites;
    }

    public List<SiteRule> getSiteRules(UUID siteId) {
        List<SiteRule> siteRules = siteRuleRepo.findAllBySiteId(siteId);
        return siteRules;
    }

    public List<SiteMember> getSiteMembers(UUID siteId) {
        List<SiteMember> siteMembers = siteMemberRepo.findAllBySiteId(siteId);
        return siteMembers;
    }

    @Transactional
    public void updateSiteDomain(UUID siteId, UUID ownerId, String newDomain) throws AccessDeniedException {
        Site site = siteRepo.findById(siteId)
                .orElseThrow(() -> new RuntimeException("Site not found"));
        if (!site.getOwner().getId().equals(ownerId)) {
            throw new AccessDeniedException("You do not have permission to update the domain of this site. Only the owner does.");
        }
        Optional<Site> existingSite = siteRepo.findByDomain(newDomain);
        if (existingSite.isPresent()) {
            throw new RuntimeException("Site already exists");
        }
        site.setDomain(newDomain);
        siteRepo.save(site);
    }

    @Transactional(readOnly = true)
    public InstallationStatusDTO getInstallationStatus(
            UUID siteId,
            UUID userId
    ) throws AccessDeniedException {
        SiteMember membership = siteMemberRepo.findByUserIdAndSiteId(userId, siteId)
                        .orElseThrow(() ->
                                new AccessDeniedException(
                                        "You do not have access to this site"
                                )
                        );

        if (membership.getRole() != SiteRole.OWNER) {
            throw new AccessDeniedException(
                    "Only the site owner can verify installation"
            );
        }
        Site site = membership.getSite();
        return new InstallationStatusDTO(site.isLoaded());
    }
}
