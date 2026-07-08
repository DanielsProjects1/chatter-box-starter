package com.DanielsProjects1.Chatter_Box_Starter.repo;

import com.DanielsProjects1.Chatter_Box_Starter.entities.CommentReport;
import com.DanielsProjects1.Chatter_Box_Starter.entities.ReportAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface CommentReportRepository extends JpaRepository<CommentReport, UUID> {
    boolean existsByCommentIdAndUserId(UUID commentId, UUID reporterId);
    @Query("SELECT r FROM CommentReport r " +
    "JOIN r.comment c " +
    "JOIN c.box b " +
    "WHERE b.site.id = :siteId " +
    "AND r.actionTaken = :actionTaken")
    Page<CommentReport> findPendingReportsBySite(
            @Param("siteId") UUID siteId,
            @Param("actionTaken") ReportAction actionTaken,
            Pageable pageable
    );

    @Modifying
    @Query("DELETE FROM CommentReport r WHERE r.comment.box.id = :boxId")
    void deleteByBoxId(@Param("boxId") UUID boxId);
}
