package com.DanielsProjects1.Chatter_Box_Starter.service;

import com.DanielsProjects1.Chatter_Box_Starter.dto.ReactionDTO;
import com.DanielsProjects1.Chatter_Box_Starter.entities.Comment;
import com.DanielsProjects1.Chatter_Box_Starter.entities.Reaction;
import com.DanielsProjects1.Chatter_Box_Starter.entities.ReactionType;
import com.DanielsProjects1.Chatter_Box_Starter.entities.User;
import com.DanielsProjects1.Chatter_Box_Starter.repo.CommentRepository;
import com.DanielsProjects1.Chatter_Box_Starter.repo.ReactionRepository;
import com.DanielsProjects1.Chatter_Box_Starter.repo.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReactionService {

    private ReactionRepository reactionRepo;
    private CommentRepository commentRepo;
    private UserRepository userRepo;

    public ReactionService(ReactionRepository reactionRepo, CommentRepository commentRepo, UserRepository userRepo) {
        this.reactionRepo = reactionRepo;
        this.commentRepo = commentRepo;
        this.userRepo = userRepo;
    }

    @Transactional
    public void toggleReaction(UUID commentId, UUID userId, ReactionType reactionType) {
        Optional<Reaction> exists = reactionRepo.findByCommentIdAndUserIdAndReactionType(commentId, userId, reactionType);
        if (exists.isPresent()) {
            reactionRepo.delete(exists.get());
            return;
        }
        Comment comment = commentRepo.findById(commentId)
                .orElseThrow(() -> new RuntimeException("No such comment exists"));
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("No such user exists"));
        Reaction reaction = new Reaction();
        reaction.setComment(comment);
        reaction.setUser(user);
        reaction.setReactionType(reactionType);
        reactionRepo.save(reaction);
    }

    public List<ReactionDTO> getReactionsForComment(UUID commentId, UUID userId) {
        if (!commentRepo.existsById(commentId)) {
            throw new RuntimeException("No such comment exists");
        }
        List<Object[]> reactions = reactionRepo.countReactionsForComment(commentId);
        Set<ReactionType> userReactions = new HashSet<>(reactionRepo.findReactionTypesByCommentIdAndUserId(commentId, userId));
        return reactions.stream().map(reaction -> {
                    ReactionType emoji = (ReactionType) reaction[0];
                    long count = (Long) reaction[1];
                    ReactionDTO dto = new ReactionDTO();
                    dto.setReactionType(emoji);
                    dto.setCount(count);
                    dto.setReacted(userReactions.contains(emoji));
                    return dto;
                }).collect(Collectors.toList());
    }
}
