package com.DanielsProjects1.Chatter_Box_Starter.service;

import com.DanielsProjects1.Chatter_Box_Starter.dto.CommentDTO;
import com.DanielsProjects1.Chatter_Box_Starter.dto.CommentPermissions;
import com.DanielsProjects1.Chatter_Box_Starter.dto.CommentReportDTO;
import com.DanielsProjects1.Chatter_Box_Starter.dto.ReactionDTO;
import com.DanielsProjects1.Chatter_Box_Starter.entities.*;
import com.DanielsProjects1.Chatter_Box_Starter.repo.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CommentService {

    private CommentRepository commentRepo;
    private BoxRepository boxRepo;
    private UserRepository userRepo;
    private SiteMemberRepository siteMemberRepo;
    private SiteRepository siteRepo;
    private CommentReportRepository commentReportRepo;
    private SiteRuleRepository siteRuleRepo;
    private MutedRecordRepository mutedRecordRepo;
    private ReactionRepository reactionRepo;

    public CommentService(CommentRepository commentRepo, BoxRepository boxRepo, UserRepository userRepo, SiteMemberRepository siteMemberRepo, SiteRepository siteRepo, CommentReportRepository commentReportRepo, SiteRuleRepository siteRuleRepo, MutedRecordRepository mutedRecordRepo, ReactionRepository reactionRepo) {
        this.commentRepo = commentRepo;
        this.boxRepo = boxRepo;
        this.userRepo = userRepo;
        this.siteMemberRepo = siteMemberRepo;
        this.siteRepo = siteRepo;
        this.commentReportRepo = commentReportRepo;
        this.siteRuleRepo = siteRuleRepo;
        this.mutedRecordRepo = mutedRecordRepo;
        this.reactionRepo = reactionRepo;
    }

    @Transactional
    public CommentDTO addComment(String body, UUID userId, UUID parentCommentId, UUID boxId) {
        Box box = boxRepo.findById(boxId).orElseThrow(() -> new RuntimeException("No box found for this comment."));
        if (box.isLocked()) {
            throw new RuntimeException("This box has been closed. You can not add any comments to it");
        }
        if (!box.isActive()) {
            throw new RuntimeException("The box you are attempting to comment in no longer exists.");
        }
        User author = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found."));
        Comment parent = null;
        if (parentCommentId != null) {
            parent = commentRepo.findById(parentCommentId).orElseThrow(() -> new RuntimeException("Parent comment not found."));
            if (parent.isLocked()) {
                throw new RuntimeException("This comment is locked.");
            }
        }
        Site site = box.getSite();
        if (mutedRecordRepo.isUserMuted(userId, site.getId(), Instant.now())) {
            throw new RuntimeException("You are muted on this site.");
        }
        boolean doesMemberExist = siteMemberRepo.existsByUserIdAndSiteId(userId, site.getId());
        if (!doesMemberExist) {
            SiteMember siteMember = new SiteMember();
            siteMember.setSite(site);
            siteMember.setUser(author);
            siteMemberRepo.save(siteMember);
        }
        Comment comment = new Comment();
        comment.setBox(box);
        comment.setBody(body);
        comment.setAuthor(author);
        comment.setParent(parent);
        commentRepo.save(comment);
        CommentPermissions permissions = new CommentPermissions();
        permissions.setCanEdit(true);
        permissions.setCanReply(true);
        permissions.setCanDelete(true);
        permissions.setCanReact(true);
        permissions.setCanReport(false);
        return CommentDTO.from(comment, 0, Collections.emptyList(), permissions);
    }

    @Transactional
    public void deleteComment(UUID commentId, UUID userId) throws AccessDeniedException {
        Comment comment = commentRepo.findById(commentId).orElseThrow(() -> new RuntimeException("Comment to be deleted does not exist."));
        Site site = comment.getBox().getSite();
        SiteMember member = siteMemberRepo.findByUserIdAndSiteId(userId, site.getId()).orElseThrow(() -> new RuntimeException("Site member not found."));
        if (!comment.getAuthor().getId().equals(userId) && !site.getOwner().getId().equals(userId) && member.getRole() == SiteRole.USER) {
            throw new AccessDeniedException("You do not have permission to delete this comment.");
        }
        commentRepo.delete(comment);
    }

    @Transactional
    public void editComment(UUID commentId, UUID userId, String body) throws AccessDeniedException {
        Comment comment = commentRepo.findById(commentId).orElseThrow(() -> new RuntimeException("The comment you are trying to edit does not exist."));
        if (!comment.getAuthor().getId().equals(userId)) {
            throw new AccessDeniedException("You cannot edit a comment that is not your own.");
        }
        Site site = comment.getBox().getSite();
        if (mutedRecordRepo.isUserMuted(userId, site.getId(), Instant.now())) {
            throw new RuntimeException("You are muted on this site.");
        }
        comment.setBody(body);
        commentRepo.save(comment);
    }

    @Transactional
    public void moderateComment(UUID commentId, UUID modId, UUID siteId, CommentStatus newStatus) throws AccessDeniedException {
        SiteMember moderator = siteMemberRepo.findByUserIdAndSiteId(modId, siteId).orElse(null);
        Site site = siteRepo.findById(siteId).orElseThrow(() -> new RuntimeException("Site not found."));
        boolean isModerator = moderator != null && moderator.getRole() == SiteRole.MODERATOR;
        boolean isOwner = site.getOwner().getId().equals(modId);
        if (!isModerator && !isOwner) {
            throw new AccessDeniedException("You do not have permission to make mod actions on this comment.");
        }
        Comment comment = commentRepo.findById(commentId).orElseThrow(() -> new RuntimeException("This comment does not exist."));
        comment.setStatus(newStatus);
        commentRepo.save(comment);
    }

    @Transactional
    public CommentReport reportComment(UUID commentId, UUID reporterId, UUID ruleId, ReportReason reason, String explanation) {
        if (commentReportRepo.existsByCommentIdAndUserId(commentId, reporterId)) {
            throw new RuntimeException("You have already reported this comment.");
        }
        Comment comment = commentRepo.findById(commentId).orElseThrow(() -> new RuntimeException("Comment does not exist."));
        User reporter = userRepo.findById(reporterId).orElseThrow(() -> new RuntimeException("User not found."));
        CommentReport report = new CommentReport();
        report.setComment(comment);
        report.setUser(reporter);
        report.setReason(reason);
        if (reason == ReportReason.OTHER && explanation != null) {
            report.setViolatedRule(null);
            report.setExplanation(explanation);
        } else if (reason == ReportReason.VIOLATED_RULE) {
            report.setViolatedRule(siteRuleRepo.findById(ruleId).orElseThrow(() -> new RuntimeException("Rule not found.")));
            report.setExplanation(null);
        } else {
            report.setViolatedRule(null);
            report.setExplanation(null);
        }
        commentReportRepo.save(report);
        return report;
    }

    public Page<CommentDTO> getCommentsByBox(UUID boxId, int page, int size, UUID userId) {
        Box box = boxRepo.findById(boxId).orElseThrow(() -> new RuntimeException("Box not found."));
        if (!box.isActive()) {
            throw new RuntimeException("This box no longer exists");
        }
        UUID siteId = box.getSite().getId();
        SiteMember member = userId != null ? siteMemberRepo.findByUserIdAndSiteId(siteId, siteId).orElse(null) : null;
        boolean isMuted = userId != null && mutedRecordRepo.isUserMuted(userId, siteId, Instant.now());

        Sort sort = Sort.by(
                Sort.Order.desc("pinned"),
                Sort.Order.asc("createdAt")
        );
        Pageable pageable = PageRequest.of(page, size, sort);
        return commentRepo.findAllByBoxIdAndParentIsNull(boxId, pageable)
                .map(comment -> {
                    long replyCount = commentRepo.countByParentId(comment.getId());
                    List<ReactionDTO> reactions = buildReactionDTOs(comment.getId(), userId);
                    CommentPermissions permissions = buildPermissions(comment, userId, box, member, isMuted);
                    return CommentDTO.from(comment, replyCount, reactions, permissions);
                });
    }

    public Page<CommentDTO> getRepliesByComment(UUID parentId, int page, int size, UUID userId) {
        // Fetching the parent comment here only serves as validating its existence.
        Comment parent = commentRepo.findById(parentId).orElseThrow(() -> new RuntimeException("The parent comment does not exist."));
        Box box = parent.getBox();
        UUID siteId = box.getSite().getId();
        SiteMember member = userId != null ? siteMemberRepo.findByUserIdAndSiteId(userId, siteId).orElse(null) : null;
        boolean isMuted = userId != null && mutedRecordRepo.isUserMuted(userId, siteId, Instant.now());
        Sort sort = Sort.by(
                Sort.Order.desc("pinned"),
                Sort.Order.asc("createdAt")
        );
        Pageable pageable = PageRequest.of(page, size, sort);
        return commentRepo.findByParentId(parentId, pageable)
                .map(comment -> {
                    long replyCount = commentRepo.countByParentId(comment.getId());
                    List<ReactionDTO> reactions = buildReactionDTOs(comment.getId(), userId);
                    CommentPermissions permissions = buildPermissions(comment, userId, box, member, isMuted);
                    return CommentDTO.from(comment, replyCount, reactions, permissions);
                });
    }

    @Transactional
    public void toggleCommentLock(UUID commentId, UUID lockerId) throws AccessDeniedException {
        Comment comment = commentRepo.findById(commentId).orElseThrow(() -> new RuntimeException("This comment does not exist."));
        Site site = comment.getBox().getSite();
        SiteMember member = siteMemberRepo.findByUserIdAndSiteId(lockerId, site.getId()).orElse(null);
        boolean isModerator = member != null && member.getRole() == SiteRole.MODERATOR;
        boolean isOwner = site.getOwner().getId().equals(lockerId);
        if (!isModerator && !isOwner) {
            throw new AccessDeniedException("You do not have permission to lock a comment on this site.");
        }
        comment.setLocked(!comment.isLocked());
        commentRepo.save(comment);
    }

    @Transactional
    public void toggleCommentPin(UUID commentId, UUID lockerId) throws AccessDeniedException {
        Comment comment = commentRepo.findById(commentId).orElseThrow(() -> new RuntimeException("This comment does not exist."));
        Site site = comment.getBox().getSite();
        SiteMember member = siteMemberRepo.findByUserIdAndSiteId(lockerId, site.getId()).orElse(null);
        boolean isModerator = member != null && member.getRole() == SiteRole.MODERATOR;
        boolean isOwner = site.getOwner().getId().equals(lockerId);
        if (!isModerator && !isOwner) {
            throw new AccessDeniedException("You do not have permission to pin a comment on this site.");
        }
        comment.setPinned(!comment.isPinned());
        commentRepo.save(comment);
    }

    public Page<CommentReportDTO> getReportQueue(UUID siteId, UUID modId, int page, int size) throws AccessDeniedException {
        SiteMember siteMember = siteMemberRepo.findByUserIdAndSiteId(modId, siteId).orElseThrow(() -> new RuntimeException("Invalid user id on this site."));
        boolean isModOrOwner = siteMember.getRole() == SiteRole.MODERATOR ||  siteMember.getRole() == SiteRole.OWNER;
        if (!isModOrOwner) {
            throw new AccessDeniedException("You don't have permission to view report queue for this site.");
        }
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").ascending());
        return commentReportRepo.findPendingReportsBySite(siteId, ReportAction.PENDING, pageable)
                .map(report -> CommentReportDTO.from(report));
    }

    @Transactional
    public void resolveReport(UUID reportId, UUID modId, UUID siteId, ReportAction action) throws AccessDeniedException {
        SiteMember mod = siteMemberRepo.findByUserIdAndSiteId(modId, siteId).orElseThrow(() -> new RuntimeException("You're not a mod on this site."));
        boolean isModOrOwner = mod.getRole() == SiteRole.MODERATOR || mod.getRole() == SiteRole.OWNER;
        if (!isModOrOwner) {
            throw new AccessDeniedException("Only mods and the site owner can resolve a report.");
        }
        CommentReport report = commentReportRepo.findById(reportId).orElseThrow(() -> new RuntimeException("Report does not exist."));
        report.setActionTaken(action);
        commentReportRepo.save(report);
    }

    @Transactional
    public void muteUser(UUID siteId, UUID muterId, UUID userId, String reason) {
        SiteMember mod = siteMemberRepo.findByUserIdAndSiteId(muterId, siteId).orElseThrow(() -> new RuntimeException("No mod or owner by this id on this site."));
        SiteMember member = siteMemberRepo.findByUserIdAndSiteId(userId, siteId).orElseThrow(() -> new RuntimeException("User does not exist."));
        boolean isModOrOwner = mod.getRole() == SiteRole.MODERATOR || mod.getRole() == SiteRole.OWNER;
        if (!isModOrOwner) {
            throw new RuntimeException("Only mods and the site owner can mute other users.");
        }
        if (mutedRecordRepo.findByMutedUserIdAndSiteId(userId, siteId).isPresent()) {
            throw new RuntimeException("This user is already muted.");
        }
        User user = member.getUser();
        User muter = mod.getUser();
        Site site = member.getSite();
        if (member.getRole().ordinal() >= mod.getRole().ordinal()) {
            throw new RuntimeException("You cannot mute this user.");
        }
        MutedRecord record = new MutedRecord();
        record.setMutedUser(user);
        record.setMutedBy(muter);
        record.setSite(site);
        record.setReason(reason);
        mutedRecordRepo.save(record);
    }

    @Transactional
    public void unmuteUser(UUID siteId, UUID muterId, UUID userId) {
        SiteMember mod = siteMemberRepo.findByUserIdAndSiteId(muterId, siteId).orElseThrow(() -> new RuntimeException("No mod or owner by this id on this site."));
        SiteMember member = siteMemberRepo.findByUserIdAndSiteId(userId, siteId).orElseThrow(() -> new RuntimeException("User does not exist."));
        boolean isModOrOwner = mod.getRole() == SiteRole.MODERATOR || mod.getRole() == SiteRole.OWNER;
        if (!isModOrOwner) {
            throw new RuntimeException("Only mods and the site owner can mute other users.");
        }
        MutedRecord record = mutedRecordRepo.findByMutedUserIdAndSiteId(userId, siteId).orElseThrow(() -> new RuntimeException("No user by that id to unmute on this site."));
        mutedRecordRepo.delete(record);
    }

    private List<ReactionDTO> buildReactionDTOs(UUID commentId, UUID userId) {
        List<Object[]> counts = reactionRepo.countReactionsForComment(commentId);
        Set<ReactionType> userReactions = userId != null
                ? new HashSet<>(reactionRepo.findReactionTypesByCommentIdAndUserId(commentId, userId))
                : Collections.emptySet();
        return counts.stream().map(reaction -> {
            ReactionType emoji = (ReactionType) reaction[0];
            long count = (Long) reaction[1];
            ReactionDTO dto = new ReactionDTO();
            dto.setReactionType(emoji);
            dto.setCount(count);
            dto.setReacted(userReactions.contains(emoji));
            return dto;
        }).collect(Collectors.toList());
    }

    private CommentPermissions buildPermissions(Comment comment, UUID userId, Box box, SiteMember member, boolean isMuted) {
        boolean canReply = !box.isLocked() && !comment.isLocked() && !isMuted;
        boolean canReact = canReply;
        boolean isAuthor = comment.getAuthor().getId().equals(userId);
        boolean canReport = member != null && member.getRole() == SiteRole.USER && !isAuthor;
        boolean canDelete = member != null && (comment.getAuthor().getId().equals(member.getUser().getId()) || member.getRole().ordinal() > SiteRole.USER.ordinal());
        CommentPermissions permissions = new CommentPermissions();
        permissions.setCanEdit(isAuthor);
        permissions.setCanDelete(canDelete);
        permissions.setCanReact(canReact);
        permissions.setCanReport(canReport);
        permissions.setCanReply(canReply);
        return permissions;
    }

}
