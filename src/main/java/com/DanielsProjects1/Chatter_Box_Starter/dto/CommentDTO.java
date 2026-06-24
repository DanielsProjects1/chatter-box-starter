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
        dto.body = comment.getBody();
        if (comment.getStatus() == CommentStatus.DELETED) {
            dto.body = "[deleted]";
            UserDTO deletedUser = new UserDTO();
            deletedUser.setUsername("[deleted]");
            deletedUser.setDisplayName("[deleted]");
            dto.author = deletedUser;
            permissions = new CommentPermissions(); // all false
        } else {
            dto.body = comment.getBody();
            dto.author = UserDTO.from(comment.getAuthor());
        }
        dto.parentId = comment.getParent() != null ? comment.getParent().getId() : null;
        dto.createdDate = comment.getCreatedAt();
        dto.status = comment.getStatus();
        dto.isLocked = comment.isLocked();
        dto.isPinned = comment.isPinned();
        dto.reactions = reactions;
        dto.permissions = permissions;
        dto.replyCount = replyCount;
        return dto;
    }
}
