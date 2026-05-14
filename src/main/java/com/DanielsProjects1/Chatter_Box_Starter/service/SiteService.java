package com.DanielsProjects1.Chatter_Box_Starter.service;

import com.DanielsProjects1.Chatter_Box_Starter.entities.Site;
import com.DanielsProjects1.Chatter_Box_Starter.entities.SiteMember;
import com.DanielsProjects1.Chatter_Box_Starter.entities.SiteRole;
import com.DanielsProjects1.Chatter_Box_Starter.entities.User;
import com.DanielsProjects1.Chatter_Box_Starter.repo.SiteMemberRepository;
import com.DanielsProjects1.Chatter_Box_Starter.repo.SiteRepository;
import com.DanielsProjects1.Chatter_Box_Starter.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class SiteService {

    private SiteRepository siteRepo;
    private UserRepository userRepo;
    private SiteMemberRepository siteMemberRepo;

    public SiteService(SiteRepository siteRepo, UserRepository userRepo, SiteMemberRepository siteMemberRepo) {
        this.siteRepo = siteRepo;
        this.userRepo = userRepo;
        this.siteMemberRepo = siteMemberRepo;
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

        siteRepo.save(site);
        SiteMember membership = new SiteMember();
        membership.setSite(site);
        membership.setUser(user);
        membership.setRole(SiteRole.OWNER);
        siteMemberRepo.save(membership);
        return site;
    }
}
