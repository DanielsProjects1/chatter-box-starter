package com.DanielsProjects1.Chatter_Box_Starter.repo;

import com.DanielsProjects1.Chatter_Box_Starter.entities.SiteMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SiteMemberRepository extends JpaRepository<SiteMember, UUID> {
    Optional<SiteMember> findByUserIdAndSiteId(UUID userId, UUID siteId);
    List<SiteMember> findAllBySiteId(UUID siteId);
    boolean existsByUserIdAndSiteId(UUID userId, UUID siteId);
    List<SiteMember> findBySiteIdAndUserIdIn(UUID siteId, List<UUID> userIds);
}
