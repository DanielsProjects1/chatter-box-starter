package com.DanielsProjects1.Chatter_Box_Starter.repo;

import com.DanielsProjects1.Chatter_Box_Starter.entities.Box;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface BoxRepository extends JpaRepository<Box, UUID> {
    Optional<Box> findBySiteIdAndPageUrl(UUID siteId, String pageUrl);
}
