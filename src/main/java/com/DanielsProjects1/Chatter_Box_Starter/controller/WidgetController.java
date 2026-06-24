package com.DanielsProjects1.Chatter_Box_Starter.controller;

import com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs.*;
import com.DanielsProjects1.Chatter_Box_Starter.dto.BoxDTO;
import com.DanielsProjects1.Chatter_Box_Starter.dto.CommentDTO;
import com.DanielsProjects1.Chatter_Box_Starter.dto.CommentReportDTO;
import com.DanielsProjects1.Chatter_Box_Starter.dto.ReactionDTO;
import com.DanielsProjects1.Chatter_Box_Starter.entities.Box;
import com.DanielsProjects1.Chatter_Box_Starter.entities.Comment;
import com.DanielsProjects1.Chatter_Box_Starter.entities.CommentReport;
import com.DanielsProjects1.Chatter_Box_Starter.service.BoxService;
import com.DanielsProjects1.Chatter_Box_Starter.service.CommentService;
import com.DanielsProjects1.Chatter_Box_Starter.service.ReactionService;
import com.DanielsProjects1.Chatter_Box_Starter.utils.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/widget")
public class WidgetController {

    private BoxService boxService;
    private CommentService commentService;
    private ReactionService reactionService;

    public WidgetController(BoxService boxService, CommentService commentService, ReactionService reactionService) {
        this.boxService = boxService;
        this.commentService = commentService;
        this.reactionService = reactionService;
    }

    @PostMapping("/init")
    public ResponseEntity<BoxDTO> initBox(
            @RequestBody InitBoxRequest request,
            Authentication authentication
    ) {
        UUID userId = authentication != null ? SecurityUtils.getUserId(authentication) : null;
        BoxDTO box = boxService.getBox(request.getSiteId(), request.getPageUrl(), userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(box);
    }

    @GetMapping("/{boxId}/comments")
    public ResponseEntity<Page<CommentDTO>> getChatterForBox(
            @PathVariable UUID boxId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication
    ) {
        UUID userId = authentication != null ? SecurityUtils.getUserId(authentication) : null;
        return ResponseEntity.ok(commentService.getCommentsByBox(boxId, page, size, userId));
    }

    @GetMapping("/{boxId}/comments/{commentId}")
    public ResponseEntity<Page<CommentDTO>> getChatterForComment(
            @PathVariable UUID commentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication
    ) {
        UUID userId = authentication != null ? SecurityUtils.getUserId(authentication) : null;
        return ResponseEntity.ok(commentService.getRepliesByComment(commentId, page, size, userId));
    }

    @PostMapping("/{boxId}/comments")
    public ResponseEntity<CommentDTO> addChatter(
            @PathVariable UUID boxId,
            @RequestBody AddComment addComment,
            Authentication authentication
    ) {
        CommentDTO comment = commentService.addComment(addComment.getBody(), SecurityUtils.getUserId(authentication), addComment.getParentId(), boxId);
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }

    @DeleteMapping("/{boxId}/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable UUID commentId,
            Authentication authentication
    ) throws AccessDeniedException {
        commentService.deleteComment(commentId, SecurityUtils.getUserId(authentication));
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{boxId}/comments/{commentId}")
    public ResponseEntity<Void> updateComment(
            @PathVariable UUID commentId,
            @RequestBody EditComment newComment,
            Authentication authentication
    ) throws AccessDeniedException {
        commentService.editComment(commentId, SecurityUtils.getUserId(authentication), newComment.getBody());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{boxId}/comments/{commentId}/report")
    public ResponseEntity<CommentReportDTO> reportComment(
            @PathVariable UUID commentId,
            @RequestBody ReportComment reportComment,
            Authentication authentication
    ) {
        CommentReport report = commentService.reportComment(commentId, SecurityUtils.getUserId(authentication), reportComment.getRuleId(), reportComment.getReason(), reportComment.getExplanation());
        return ResponseEntity.ok(CommentReportDTO.from(report));
    }

    @PostMapping("/comments/{commentId}/reactions")
    public ResponseEntity<ReactionDTO> toggleReaction(
            @PathVariable UUID commentId,
            @RequestBody ToggleReactionRequest toggleReactionRequest,
            Authentication authentication
    ) {
        return ResponseEntity.ok(reactionService.toggleReaction(commentId, SecurityUtils.getUserId(authentication), toggleReactionRequest.getReactionType()));
    }
}
