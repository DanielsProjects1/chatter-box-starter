package com.DanielsProjects1.Chatter_Box_Starter.controller;

import com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs.ModerateComment;
import com.DanielsProjects1.Chatter_Box_Starter.ResponseDTOs.CommentReportDTO;
import com.DanielsProjects1.Chatter_Box_Starter.entities.ReportAction;
import com.DanielsProjects1.Chatter_Box_Starter.service.BoxService;
import com.DanielsProjects1.Chatter_Box_Starter.service.CommentService;
import com.DanielsProjects1.Chatter_Box_Starter.utils.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/dashboard/moderation")
public class DashboardModerationController {

    private CommentService commentService;
    private BoxService boxService;

    public DashboardModerationController(CommentService commentService, BoxService boxService) {
        this.commentService = commentService;
        this.boxService = boxService;
    }

    @PutMapping("/{siteId}/comments/{commentId}/moderate")
    public ResponseEntity<Void> moderateComment(
            @PathVariable UUID commentId,
            @PathVariable UUID siteId,
            @RequestBody ModerateComment newStatus,
            Authentication authentication
    ) throws AccessDeniedException {
        commentService.moderateComment(commentId, SecurityUtils.getUserId(authentication), siteId, newStatus.getNewStatus());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{siteId}/comments/{commentId}/lock")
    public ResponseEntity<Void> toggleCommentLock(
            @PathVariable UUID commentId,
            Authentication authentication
    ) throws AccessDeniedException {
        commentService.toggleCommentLock(commentId, SecurityUtils.getUserId(authentication));
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{siteId}/comments/{commentId}/pin")
    public ResponseEntity<Void> toggleCommentPin(
            @PathVariable UUID commentId,
            Authentication authentication
    ) throws AccessDeniedException {
        commentService.toggleCommentPin(commentId, SecurityUtils.getUserId(authentication));
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{siteId}/reports")
    public ResponseEntity<Page<CommentReportDTO>> getReportQueue(
            @PathVariable UUID siteId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            Authentication authentication
    ) throws AccessDeniedException {
        return ResponseEntity.ok(commentService.getReportQueue(siteId, SecurityUtils.getUserId(authentication), page, size));
    }

    @PutMapping("/{siteId}/reports/{reportId}")
    public ResponseEntity<Void> updateReport(
            @PathVariable UUID siteId,
            @PathVariable UUID reportId,
            Authentication authentication,
            @RequestBody ReportAction action
    ) throws AccessDeniedException {
        commentService.resolveReport(reportId, SecurityUtils.getUserId(authentication), siteId, action);
        return ResponseEntity.noContent().build();
    }


    @PostMapping("/{siteId}/mute/{userId}")
    public ResponseEntity<Void> muteUser(
            @PathVariable UUID siteId,
            @PathVariable UUID userId,
            @RequestBody String reason,
            Authentication authentication
    ) {
        commentService.muteUser(siteId, SecurityUtils.getUserId(authentication), userId, reason);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{siteId}/mute/{userId}")
    public ResponseEntity<Void> unmuteUser(
            @PathVariable UUID siteId,
            @PathVariable UUID userId,
            Authentication authentication
    ) {
        commentService.unmuteUser(siteId, SecurityUtils.getUserId(authentication), userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/boxes/{boxId}/deactivate")
    public ResponseEntity<Void> deactivateBox(
            @PathVariable UUID boxId,
            Authentication authentication
    ) throws AccessDeniedException {
        boxService.toggleBox(boxId, SecurityUtils.getUserId(authentication));
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/boxes/{boxId}/empty")
    public ResponseEntity<Void> emptyBox(
            @PathVariable UUID boxId,
            Authentication authentication
    ) throws AccessDeniedException {
        boxService.emptyBox(boxId, SecurityUtils.getUserId(authentication));
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/boxes/{boxId}/shut")
    public ResponseEntity<Void> shutBox(
            @PathVariable UUID boxId,
            Authentication authentication
    ) throws AccessDeniedException {
        boxService.shutBox(boxId, SecurityUtils.getUserId(authentication));
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/boxes/{boxId}/open")
    public ResponseEntity<Void> openBox(
            @PathVariable UUID boxId,
            Authentication authentication
    ) throws AccessDeniedException {
        boxService.openBox(boxId, SecurityUtils.getUserId(authentication));
        return ResponseEntity.noContent().build();
    }

}
