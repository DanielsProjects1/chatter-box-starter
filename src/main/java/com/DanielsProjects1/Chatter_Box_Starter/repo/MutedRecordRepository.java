package com.DanielsProjects1.Chatter_Box_Starter.repo;

import com.DanielsProjects1.Chatter_Box_Starter.entities.MutedRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface MutedRecordRepository extends JpaRepository<MutedRecord, UUID> {
    @Query("SELECT COUNT(m) > 0 FROM MutedRecord m WHERE m.mutedUser.id = :userId AND (m.site.id = :siteId OR m.site IS NULL) AND (m.expiresAt IS NULL OR m.expiresAt > :now)")
    boolean isUserMuted(@Param("userId") UUID userId, @Param("siteId") UUID siteId, @Param("now") Instant now);

    Optional<MutedRecord> findByMutedUserIdAndSiteId(UUID userId, UUID siteId);
}
