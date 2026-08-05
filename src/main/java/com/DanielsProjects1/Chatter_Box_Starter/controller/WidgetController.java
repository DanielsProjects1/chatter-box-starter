package com.DanielsProjects1.Chatter_Box_Starter.controller;

import com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs.*;
import com.DanielsProjects1.Chatter_Box_Starter.ResponseDTOs.*;
import com.DanielsProjects1.Chatter_Box_Starter.entities.CommentReport;
import com.DanielsProjects1.Chatter_Box_Starter.giphy.GifResult;
import com.DanielsProjects1.Chatter_Box_Starter.service.BoxService;
import com.DanielsProjects1.Chatter_Box_Starter.service.CommentService;
import com.DanielsProjects1.Chatter_Box_Starter.giphy.GifSearchService;
import com.DanielsProjects1.Chatter_Box_Starter.service.ReactionService;
import com.DanielsProjects1.Chatter_Box_Starter.utils.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/widget")
public class WidgetController {

    private BoxService boxService;
    private CommentService commentService;
    private ReactionService reactionService;
    private final GifSearchService gifSearchService;

    public WidgetController(BoxService boxService, CommentService commentService, ReactionService reactionService, GifSearchService gifSearchService) {
        this.boxService = boxService;
        this.commentService = commentService;
        this.reactionService = reactionService;
        this.gifSearchService = gifSearchService;
    }

    @PostMapping("/init")
    public ResponseEntity<BoxDTO> initBox(
            @RequestBody InitBoxRequest request,
            Authentication authentication
    ) {
        UUID userId = SecurityUtils
                .findUserId(authentication)
                .orElse(null);
        System.out.println("INIT AUTH = " + authentication);
        System.out.println("INIT USER ID = " + userId);
        System.out.println(request.getSiteId());
        System.out.println(request.getPageUrl());
        BoxDTO box = boxService.getBox(request.getSiteId(), request.getPageUrl(), userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(box);
    }

    @GetMapping("/boxes/{boxId}")
    public ResponseEntity<BoxDTO> getBoxForCurrentUser(
            @PathVariable UUID boxId,
            Authentication authenticaiton
    ) {
        UUID userId = SecurityUtils.getUserId(authenticaiton);
        return ResponseEntity.ok(boxService.getBoxById(boxId, userId));
    }

    @GetMapping("/{boxId}/comments")
    public ResponseEntity<Page<CommentDTO>> getChatterForBox(
            @PathVariable UUID boxId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication
    ) {
        UUID userId = SecurityUtils
                .findUserId(authentication)
                .orElse(null);
        return ResponseEntity.ok(commentService.getCommentsByBox(boxId, page, size, userId));
    }

    @GetMapping("/{boxId}/comments/{commentId}")
    public ResponseEntity<Page<CommentDTO>> getChatterForComment(
            @PathVariable UUID commentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication
    ) {
        UUID userId = SecurityUtils
                .findUserId(authentication)
                .orElse(null);
        return ResponseEntity.ok(commentService.getRepliesByComment(commentId, page, size, userId));
    }

    @PostMapping("/sites/{siteId}/boxes/{boxId}/comments")
    public ResponseEntity<CommentDTO> addChatter(
            @PathVariable UUID boxId,
            @RequestBody AddComment addComment,
            Authentication authentication
    ) {
        CommentDTO comment = commentService.addComment(addComment, SecurityUtils.getUserId(authentication), boxId);
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
        commentService.editComment(commentId, SecurityUtils.getUserId(authentication), newComment);
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

    @GetMapping("/gifs/search")
    public ResponseEntity<List<GifResult>> search(@RequestParam String q) {
        return ResponseEntity.ok(gifSearchService.search(q));
    }
}
