package com.DanielsProjects1.Chatter_Box_Starter.repo;

import com.DanielsProjects1.Chatter_Box_Starter.entities.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    @Modifying
    @Query("DELETE FROM Comment c WHERE c.box.id = :boxId AND c.parent IS NOT NULL")
    void deleteRepliesByBoxId(@Param("boxId") UUID boxId);

    @Modifying
    @Query("DELETE FROM Comment c WHERE c.box.id = :boxId AND c.parent IS NULL")
    void deleteRootCommentsByBoxId(@Param("boxId") UUID boxId);

    Page<Comment> findAllByBoxId(UUID boxId, Pageable pageable);
    Page<Comment> findAllByBoxIdAndParentIsNull(UUID boxId, Pageable pageable);
    Page<Comment> findByParentId(UUID parentId, Pageable pageable);
    long countByParentId(UUID id);
    @Query("SELECT c.parent.id, COUNT(c) FROM Comment c WHERE c.parent.id IN :parentIds GROUP BY c.parent.id")
    List<Object[]> countRepliesByParentIds(@Param("parentIds") List<UUID> parentIds);
}
