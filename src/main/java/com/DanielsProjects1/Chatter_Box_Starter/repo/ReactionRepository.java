package com.DanielsProjects1.Chatter_Box_Starter.repo;

import com.DanielsProjects1.Chatter_Box_Starter.entities.Reaction;
import com.DanielsProjects1.Chatter_Box_Starter.entities.ReactionType;
import com.DanielsProjects1.Chatter_Box_Starter.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ReactionRepository extends JpaRepository<Reaction, UUID> {
    Optional<Reaction> findByCommentIdAndUserIdAndReactionType(UUID commentId, UUID userId, ReactionType reactionType);

    @Query("SELECT r.reactionType, COUNT(r) FROM Reaction r WHERE r.comment.id = :commentId GROUP BY r.reactionType")
    List<Object[]> countReactionsForComment(@Param("commentId") UUID commentId);
    @Query("SELECT r.reactionType FROM Reaction r WHERE r.comment.id = :commentId AND r.user.id = :userId")
    List<ReactionType> findReactionTypesByCommentIdAndUserId(@Param("commentId") UUID commentId, @Param("userId") UUID userId);

    @Query("SELECT r.comment.id, r.reactionType, COUNT(r) FROM Reaction r WHERE r.comment.id IN :commentIds GROUP BY r.comment.id, r.reactionType")
    List<Object[]> countReactionsByCommentIds(@Param("commentIds") List<UUID> commentIds);
    @Query("SELECT r.comment.id, r.reactionType FROM Reaction r WHERE r.comment.id IN :commentIds AND r.user.id = :userId")
    List<Object[]> findUserReactionsByCommentIds(@Param("commentIds") List<UUID> commentIds, @Param("userId") UUID userId);

    long countByCommentIdAndReactionType(UUID commentId, ReactionType reactionType);
    @Modifying
    @Query("DELETE FROM Reaction r WHERE r.comment.id = :commentId")
    void deleteByCommentId(@Param("commentId") UUID commentId);

    @Modifying
    @Query("DELETE FROM Reaction r WHERE r.comment.box.id = :boxId")
    void deleteByBoxId(@Param("boxId") UUID boxId);
}