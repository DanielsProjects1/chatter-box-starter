package com.DanielsProjects1.Chatter_Box_Starter.service;

import com.DanielsProjects1.Chatter_Box_Starter.entities.Box;
import com.DanielsProjects1.Chatter_Box_Starter.entities.Site;
import com.DanielsProjects1.Chatter_Box_Starter.repo.BoxRepository;
import com.DanielsProjects1.Chatter_Box_Starter.repo.CommentRepository;
import com.DanielsProjects1.Chatter_Box_Starter.repo.SiteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.Optional;
import java.util.UUID;

@Service
public class BoxService {

    private BoxRepository boxRepo;
    private SiteRepository siteRepo;
    private CommentRepository commentRepo;

    public BoxService(BoxRepository boxRepo, SiteRepository siteRepo, CommentRepository commentRepo) {
        this.boxRepo = boxRepo;
        this.siteRepo = siteRepo;
        this.commentRepo = commentRepo;
    }

    @Transactional
    public Box createBox(UUID siteId, String pageUrl) {
        Optional<Box> existingBox = boxRepo.findBySiteIdAndPageUrl(siteId, pageUrl);
        if (existingBox.isPresent()) {
            Box box = existingBox.get();
            if (!box.isActive()) {
                box.setActive(true);
                boxRepo.save(box);
            }
            return box;
        }
        Box box = new Box();
        Site site = siteRepo.findById(siteId).orElseThrow(() -> new RuntimeException("Site not found"));
        box.setSite(site);
        box.setPageUrl(pageUrl);
        boxRepo.save(box);
        return box;
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
        commentRepo.deleteAllByBoxId(box.getId());

    }

    @Transactional
    public void deactivateBox(UUID boxId, UUID ownerId) throws AccessDeniedException {
        Box box = boxRepo.findById(boxId)
                .orElseThrow(() -> new RuntimeException("No box found."));
        Site site = box.getSite();
        if (!site.getOwner().getId().equals(ownerId)) {
            throw new AccessDeniedException("You do not have permission to deactivate this box.");
        }
        box.setActive(false);
        boxRepo.save(box);
    }
}
