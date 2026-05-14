package com.DanielsProjects1.Chatter_Box_Starter.repo;

import com.DanielsProjects1.Chatter_Box_Starter.entities.Site;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface SiteRepository extends JpaRepository<Site, UUID> {
    Optional<Site> findByDomain(String domain);
}
