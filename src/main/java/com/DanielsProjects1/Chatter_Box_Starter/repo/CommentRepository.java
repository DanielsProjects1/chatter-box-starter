package com.DanielsProjects1.Chatter_Box_Starter.repo;

import com.DanielsProjects1.Chatter_Box_Starter.entities.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface CommentRepository extends JpaRepository<Comment, UUID> {
    void deleteAllByBoxId(UUID boxId);
    Page<Comment> findAllByBoxId(UUID boxId, Pageable pageable);
    Page<Comment> findAllByBoxIdAndParentIsNull(UUID boxId, Pageable pageable);
    Page<Comment> findByParentId(UUID parentId, Pageable pageable);
    long countByParentId(UUID id);
}
