package com.DanielsProjects1.Chatter_Box_Starter.dto;

import com.DanielsProjects1.Chatter_Box_Starter.entities.Comment;
import com.DanielsProjects1.Chatter_Box_Starter.entities.CommentStatus;
import lombok.Data;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Data
public class CommentDTO {
    private UUID id;
    private String body;
    private String gifUrl;
    private String gifPreviewUrl;
    private String gifProvider;
    private String gifProviderId;
    private String gifTitle;
    private UserDTO author;
    private UUID parentId;
    private Instant createdDate;
    private CommentStatus status;
    private boolean isLocked;
    private boolean isPinned;
    private List<ReactionDTO> reactions;
    private CommentPermissions permissions;
    private long replyCount;

    public static CommentDTO from(Comment comment, long replyCount, List<ReactionDTO> reactions, CommentPermissions permissions) {
        CommentDTO dto = new CommentDTO();
        dto.id = comment.getId();
        boolean isDeleted = comment.getStatus() == CommentStatus.DELETED;
        boolean isRemoved = comment.getStatus() == CommentStatus.REMOVED;
        if (isDeleted || isRemoved) {
            String label = isRemoved ? "[removed]" : "[deleted]";
            dto.body = label;
            UserDTO hiddenUser = new UserDTO();
            hiddenUser.setUsername(label);
            hiddenUser.setDisplayName(label);
            dto.author = hiddenUser;
            dto.gifUrl = null;
            dto.gifPreviewUrl = null;
            dto.gifProvider = null;
            dto.gifProviderId = null;
            dto.gifTitle = null;
            dto.reactions = List.of();
            dto.permissions = new CommentPermissions();
        } else {
            dto.body = comment.getBody();
            dto.gifUrl = comment.getGifUrl();
            dto.gifPreviewUrl = comment.getGifPreviewUrl();
            dto.gifProvider = comment.getGifProvider();
            dto.gifProviderId = comment.getGifProviderId();
            dto.gifTitle = comment.getGifTitle();
            dto.author = UserDTO.from(comment.getAuthor());
            dto.reactions = reactions;
            dto.permissions = permissions;
        }
        dto.parentId = comment.getParent() != null ? comment.getParent().getId() : null;
        dto.createdDate = comment.getCreatedAt();
        dto.status = comment.getStatus();
        dto.isLocked = comment.isLocked();
        dto.isPinned = comment.isPinned();
        dto.replyCount = replyCount;
        return dto;
    }
}
