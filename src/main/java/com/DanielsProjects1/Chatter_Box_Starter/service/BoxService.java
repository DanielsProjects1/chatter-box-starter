package com.DanielsProjects1.Chatter_Box_Starter.service;

import com.DanielsProjects1.Chatter_Box_Starter.dto.BoxDTO;
import com.DanielsProjects1.Chatter_Box_Starter.dto.BoxPermissions;
import com.DanielsProjects1.Chatter_Box_Starter.entities.*;
import com.DanielsProjects1.Chatter_Box_Starter.repo.*;
import com.DanielsProjects1.Chatter_Box_Starter.utils.CachedBox;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BoxService {

    private final BoxRepository boxRepo;
    private final SiteRepository siteRepo;
    private final CommentRepository commentRepo;
    private final SiteMemberRepository siteMemberRepo;
    private final BoxCacheService boxCacheService;
    private final ReactionRepository reactionRepo;
    private final CommentReportRepository commentReportRepo;

//    public BoxService(BoxRepository boxRepo, SiteRepository siteRepo, CommentRepository commentRepo, SiteMemberRepository siteMemberRepo, BoxCacheService boxCacheService) {
//        this.boxRepo = boxRepo;
//        this.siteRepo = siteRepo;
//        this.commentRepo = commentRepo;
//        this.siteMemberRepo = siteMemberRepo;
//        this.boxCacheService = boxCacheService;
//    }

    @Transactional
    public Box createBox(UUID siteId, String pageUrl) {
//        Optional<Box> existingBox = boxRepo.findBySiteIdAndPageUrl(siteId, pageUrl);
//        if (existingBox.isPresent()) {
//            Box box = existingBox.get();
//            if (!box.isActive()) {
//                box.setActive(true);
//                boxRepo.save(box);
//            }
//            return box;
//        }
        Box box = new Box();
        Site site = siteRepo.findById(siteId).orElseThrow(() -> new RuntimeException("Site not found"));
        box.setSite(site);
        box.setPageUrl(pageUrl);
        boxRepo.save(box);
        return box;
    }

    @Transactional
    public BoxDTO getBox(UUID siteId, String pageUrl, UUID userId) {
        CachedBox cachedBox = boxCacheService.getCachedBox(siteId, pageUrl);
        if (cachedBox != null) {
            return BoxDTO.fromCached(
                    cachedBox,
                    buildBoxPermissions(cachedBox.siteId(), userId)
            );
        }
        System.out.println("Looking up box in DB");
        Box box = boxRepo.findBySiteIdAndPageUrl(siteId, pageUrl)
                .orElseGet(() -> createBox(siteId, pageUrl));
        boxCacheService.cacheBox(siteId, pageUrl, box);
        return BoxDTO.from(box, buildBoxPermissions(box, userId));
    }

    public BoxDTO getBoxById(UUID boxId, UUID userId) {
        Box box = boxRepo.findById(boxId).orElseThrow(() -> new RuntimeException("Box not found"));
        return BoxDTO.from(box, buildBoxPermissions(box, userId));
    }

    @Transactional
    public void shutBox(UUID boxId, UUID ownerId) throws AccessDeniedException {
        Box box = boxRepo.findById(boxId)
                .orElseThrow(() -> new RuntimeException("No box found."));
        Site site = box.getSite();
        if (!site.getOwner().getId().equals(ownerId)) {
            throw new AccessDeniedException("You do not have permission to shut this box.");
        }
        box.setLocked(true);
        boxRepo.save(box);
    }

    @Transactional
    public void openBox(UUID boxId, UUID ownerId) throws AccessDeniedException {
        Box box = boxRepo.findById(boxId)
                .orElseThrow(() -> new RuntimeException("No box found."));
        Site site = box.getSite();
        if (!site.getOwner().getId().equals(ownerId)) {
            throw new AccessDeniedException("You do not have permission to shut this box.");
        }
        box.setLocked(false);
        boxRepo.save(box);
    }

    @Transactional
    public void emptyBox(UUID boxId, UUID ownerId) throws AccessDeniedException {
        Box box = boxRepo.findById(boxId)
                .orElseThrow(() -> new RuntimeException("No box found."));
        Site site = box.getSite();
        if (!site.getOwner().getId().equals(ownerId)) {
            throw new AccessDeniedException("You do not have permission to empty this box.");
        }
        reactionRepo.deleteByBoxId(boxId);
        commentReportRepo.deleteByBoxId(boxId);
        commentRepo.deleteRepliesByBoxId(boxId);
        commentRepo.deleteRootCommentsByBoxId(boxId);

    }

    @Transactional
    public void toggleBox(UUID boxId, UUID ownerId) throws AccessDeniedException {
        Box box = boxRepo.findById(boxId)
                .orElseThrow(() -> new RuntimeException("No box found."));
        Site site = box.getSite();
        if (!site.getOwner().getId().equals(ownerId)) {
            throw new AccessDeniedException("You do not have permission to activate/deactivate this box.");
        }
        boolean isActive = box.isActive();
        box.setActive(!isActive);
        boxRepo.save(box);
    }

    private BoxPermissions buildBoxPermissions(Box box, UUID userId) {
        return buildBoxPermissions(box.getSite().getId(), userId);
    }

    private BoxPermissions buildBoxPermissions(UUID siteId, UUID userId) {
        if (userId == null) return new BoxPermissions();
        Site site = siteRepo.findById(siteId)
                .orElseThrow(() -> new RuntimeException("Site not found."));
        SiteMember member = siteMemberRepo
                .findByUserIdAndSiteId(userId, siteId)
                .orElse(null);
        boolean isOwner = site.getOwner().getId().equals(userId);
        boolean isModerator = member != null && member.getRole() == SiteRole.MODERATOR;
        BoxPermissions permissions = new BoxPermissions();
        permissions.setCanToggleBox(isOwner || isModerator);
        permissions.setCanEmptyBox(isOwner);
        permissions.setCanToggleBoxLock(isOwner || isModerator);
        return permissions;
    }
}
