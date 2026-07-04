package com.DanielsProjects1.Chatter_Box_Starter.service;

import com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs.AddComment;
import com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs.EditComment;
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
    private final GifValidationService gifValidationService;

    public CommentService(CommentRepository commentRepo, BoxRepository boxRepo, UserRepository userRepo, SiteMemberRepository siteMemberRepo, SiteRepository siteRepo, CommentReportRepository commentReportRepo, SiteRuleRepository siteRuleRepo, MutedRecordRepository mutedRecordRepo, ReactionRepository reactionRepo, GifValidationService gifValidationService) {
        this.commentRepo = commentRepo;
        this.boxRepo = boxRepo;
        this.userRepo = userRepo;
        this.siteMemberRepo = siteMemberRepo;
        this.siteRepo = siteRepo;
        this.commentReportRepo = commentReportRepo;
        this.siteRuleRepo = siteRuleRepo;
        this.mutedRecordRepo = mutedRecordRepo;
        this.reactionRepo = reactionRepo;
        this.gifValidationService = gifValidationService;
    }

    @Transactional
    public CommentDTO addComment(AddComment req, UUID userId, UUID boxId) {
        Box box = boxRepo.findById(boxId).orElseThrow(() -> new RuntimeException("No box found for this comment."));
        if (box.isLocked()) {
            throw new RuntimeException("This box has been closed. You can not add any comments to it");
        }
        if (!box.isActive()) {
            throw new RuntimeException("The box you are attempting to comment in no longer exists.");
        }
        User author = userRepo.findById(userId).orElseThrow(() -> new RuntimeException("User not found."));
        Comment parent = null;

        UUID parentCommentId = req.getParentId();
        if (parentCommentId != null) {
            parent = commentRepo.findById(parentCommentId).orElseThrow(() -> new RuntimeException("Parent comment not found."));
            if (parent.isLocked()) {
                throw new RuntimeException("This comment is locked.");
            }
            if (parent.getStatus() == CommentStatus.DELETED ||
                    parent.getStatus() == CommentStatus.REMOVED) {
                throw new RuntimeException("You cannot reply to a deleted comment.");
            }
        }

        Site site = box.getSite();
        if (mutedRecordRepo.isUserMuted(userId, site.getId(), Instant.now())) {
            throw new RuntimeException("You are muted on this site.");
        }
        String body = req.normalizedBody();
        boolean hasText = !body.isBlank();
        boolean hasGif = req.hasGif();
        if (!hasText && !hasGif) {
            throw new RuntimeException("Comment must contain text or a GIF.");
        }
        if (hasGif) {
            gifValidationService.validate(req);
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
        if (hasGif) {
            comment.setGifUrl(req.getGifUrl());
            comment.setGifPreviewUrl(req.getGifPreviewUrl());
            comment.setGifProvider(req.getGifProvider());
            comment.setGifProviderId(req.getGifProviderId());
            comment.setGifTitle(req.getGifTitle());
        }
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
        if (comment.getStatus() != CommentStatus.VISIBLE && comment.getStatus() != CommentStatus.FLAGGED) return;
        Site site = comment.getBox().getSite();
        SiteMember member = siteMemberRepo.findByUserIdAndSiteId(userId, site.getId()).orElse(null);
        boolean isAuthor = comment.getAuthor().getId().equals(userId);
        boolean isOwner = site.getOwner().getId().equals(userId);
        boolean isMod = member != null && member.getRole() == SiteRole.MODERATOR;
        if (!isAuthor && !isMod && !isOwner) {
            throw new AccessDeniedException("You do not have permission to delete this comment.");
        }

        if (isAuthor) {
            comment.setBody("[deleted]");
            comment.setStatus(CommentStatus.DELETED);
        } else {
            comment.setBody("[removed]");
            comment.setStatus(CommentStatus.REMOVED);
        }
        comment.setLocked(true);
        reactionRepo.deleteByCommentId(commentId);
        commentRepo.save(comment);
    }

    @Transactional
    public void editComment(UUID commentId, UUID userId, EditComment req) throws AccessDeniedException {
        Comment comment = commentRepo.findById(commentId).orElseThrow(() -> new RuntimeException("The comment you are trying to edit does not exist."));
        if (!comment.getAuthor().getId().equals(userId)) {
            throw new AccessDeniedException("You cannot edit a comment that is not your own.");
        }
        Site site = comment.getBox().getSite();
        if (mutedRecordRepo.isUserMuted(userId, site.getId(), Instant.now())) {
            throw new RuntimeException("You are muted on this site.");
        }
        if (comment.getStatus() == CommentStatus.DELETED ||
                comment.getStatus() == CommentStatus.REMOVED) {
            throw new RuntimeException("You cannot edit a deleted comment.");
        }
        String body = req.normalizedBody();
        boolean bodyProvided = req.hasBodyPatch();
        boolean hasNewText = bodyProvided && !body.isBlank();
        boolean hasExistingText = comment.getBody() != null && !comment.getBody().isBlank();
        boolean hasGif = req.hasGif();
        boolean hasExistingGif = comment.getGifUrl() != null && !comment.getGifUrl().isBlank();
        boolean willHaveGif = req.isRemoveGif() ? false : (hasGif || hasExistingGif);
        boolean willHaveText = bodyProvided ? hasNewText : hasExistingText;
        if (!willHaveText && !willHaveGif) {
            throw new RuntimeException("Comment must contain text or a GIF.");
        }
        if (hasGif) gifValidationService.validate(req);
        if (bodyProvided) comment.setBody(body);

        if (req.isRemoveGif()) {
            clearGif(comment);
        } else if (hasGif) {
            comment.setGifUrl(req.getGifUrl());
            comment.setGifPreviewUrl(req.getGifPreviewUrl());
            comment.setGifProvider(req.getGifProvider());
            comment.setGifProviderId(req.getGifProviderId());
            comment.setGifTitle(req.getGifTitle());
        }
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
        UUID siteId = box.getSite().getId();
        SiteMember member = userId != null ? siteMemberRepo.findByUserIdAndSiteId(userId, siteId).orElse(null) : null;
        boolean isOwner = userId != null && box.getSite().getOwner().getId().equals(userId);
        boolean isMod = member != null && member.getRole() == SiteRole.MODERATOR;
        boolean canManageBox = isOwner || isMod;

        boolean isMuted = userId != null && mutedRecordRepo.isUserMuted(userId, siteId, Instant.now());
        Sort sort = Sort.by(
                Sort.Order.desc("pinned"),
                Sort.Order.asc("createdAt")
        );
        Pageable pageable = PageRequest.of(page, size, sort);
        if (!box.isActive() && !canManageBox) {
            return Page.empty(PageRequest.of(page, size));
        }
        Page<Comment> comments = commentRepo.findAllByBoxIdAndParentIsNull(boxId, pageable);
        List<UUID> authorIds = comments.getContent().stream()
                .map(c -> c.getAuthor().getId())
                .distinct()
                .collect(Collectors.toList());
        Map<UUID, SiteMember> authorMemberships = authorIds.isEmpty() ? Collections.emptyMap() :
                siteMemberRepo.findBySiteIdAndUserIdIn(siteId, authorIds)
                        .stream()
                        .collect(Collectors.toMap(siteMember -> siteMember.getUser().getId(), siteMember -> siteMember));

        List<UUID> commentIds = comments.getContent().stream()
                .map(Comment::getId)
                .collect(Collectors.toList());

        // stream the list of objects containing commentId, reactionType, count of that type and
        // store in a map grouping them by commentId
        Map<UUID, List<Object[]>> allCounts = reactionRepo.countReactionsByCommentIds(commentIds)
                .stream()
                .collect(Collectors.groupingBy(row -> (UUID) row[0]));

        Set<String> userReactionKeys = userId != null
                ? reactionRepo.findUserReactionsByCommentIds(commentIds, userId)
                    .stream()
                    .map(row -> row[0] + ":" + row[1]) // commentId:reactionType
                    .collect(Collectors.toSet())
                : Collections.emptySet();

        Map<UUID, Long> replyCounts = commentRepo.countRepliesByParentIds(commentIds)
                .stream()
                .collect(Collectors.toMap(row -> (UUID) row[0], row -> (Long) row[1]));

        return comments.map(comment -> {
                    long replyCount = replyCounts.getOrDefault(comment.getId(), 0L);
                    List<ReactionDTO> reactions = buildReactionDTOs(comment.getId(), userId, allCounts, userReactionKeys);
                    SiteMember authorMember = authorMemberships.get(comment.getAuthor().getId());
                    CommentPermissions permissions = buildPermissions(comment, userId, box, member, isMuted, authorMember);
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
        Page<Comment> comments = commentRepo.findByParentId(parentId, pageable);
        List<UUID> authorIds = comments.getContent().stream()
                .map(c -> c.getAuthor().getId())
                .distinct()
                .collect(Collectors.toList());
        Map<UUID, SiteMember> authorMemberships = authorIds.isEmpty() ? Collections.emptyMap() :
                siteMemberRepo.findBySiteIdAndUserIdIn(siteId, authorIds)
                        .stream()
                        .collect(Collectors.toMap(siteMember -> siteMember.getUser().getId(), siteMember -> siteMember));

        List<UUID> commentIds = comments.getContent().stream()
                .map(Comment::getId)
                .collect(Collectors.toList());

        Map<UUID, List<Object[]>> allCounts = reactionRepo.countReactionsByCommentIds(commentIds)
                .stream()
                .collect(Collectors.groupingBy(row -> (UUID) row[0]));

        Set<String> userReactionKeys = userId != null
                ? reactionRepo.findUserReactionsByCommentIds(commentIds, userId)
                    .stream()
                    .map(row -> row[0] + ":" + row[1])
                    .collect(Collectors.toSet())
                : Collections.emptySet();

        Map<UUID, Long> replyCounts = commentRepo.countRepliesByParentIds(commentIds)
                .stream()
                .collect(Collectors.toMap(row -> (UUID) row[0], row -> (Long) row[1]));

        return comments.map(comment -> {
                    long replyCount = replyCounts.getOrDefault(comment.getId(), 0L);
                    List<ReactionDTO> reactions = buildReactionDTOs(comment.getId(), userId, allCounts, userReactionKeys);
                    SiteMember authorMember = authorMemberships.get(comment.getAuthor().getId());
                    CommentPermissions permissions = buildPermissions(comment, userId, box, member, isMuted, authorMember);
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

    private List<ReactionDTO> buildReactionDTOs(UUID commentId, UUID userId, Map<UUID, List<Object[]>> allCounts, Set<String> userReactionKeys) {
        List<Object[]> counts = allCounts.getOrDefault(commentId, Collections.emptyList());
        return counts.stream().map(reaction -> {
            ReactionType emoji = (ReactionType) reaction[1];
            long count = (Long) reaction[2];
            ReactionDTO dto = new ReactionDTO();
            dto.setReactionType(emoji);
            dto.setCount(count);
            dto.setReacted(userReactionKeys.contains(commentId + ":" + emoji));
            return dto;
        }).collect(Collectors.toList());
    }

    private CommentPermissions buildPermissions(Comment comment, UUID userId, Box box, SiteMember member, boolean isMuted, SiteMember authorMember) {
        boolean canReply = !box.isLocked() && !comment.isLocked() && !isMuted;
        boolean canReact = canReply;
        boolean isAuthor = comment.getAuthor().getId().equals(userId);
        boolean isModerator = member != null && member.getRole() == SiteRole.MODERATOR;
        boolean isOwner = box.getSite().getOwner().getId().equals(userId);
        boolean authorIsMod = authorMember != null && authorMember.getRole() == SiteRole.MODERATOR;
        boolean authorIsOwner = authorMember != null && authorMember.getUser().getId().equals(box.getSite().getOwner().getId());
        boolean canReport = member != null && member.getRole() == SiteRole.USER && !isAuthor;
        boolean canDelete = member != null && (comment.getAuthor().getId().equals(userId) || member.getRole().ordinal() > SiteRole.USER.ordinal());
        CommentPermissions permissions = new CommentPermissions();
        permissions.setCanEdit(isAuthor);
        permissions.setCanDelete(canDelete);
        permissions.setCanReact(canReact);
        permissions.setCanReport(canReport);
        permissions.setCanReply(canReply);
        permissions.setCanMuteAuthor((isModerator || isOwner) && !isAuthor && !authorIsMod && !authorIsOwner);
        permissions.setCanLock(isModerator || isOwner);
        permissions.setCanPin(isModerator || isOwner);
        return permissions;
    }

    private void clearGif(Comment comment) {
        comment.setGifUrl(null);
        comment.setGifPreviewUrl(null);
        comment.setGifProvider(null);
        comment.setGifProviderId(null);
        comment.setGifTitle(null);
    }
}
