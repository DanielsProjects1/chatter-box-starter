package com.DanielsProjects1.Chatter_Box_Starter.dto;

import com.DanielsProjects1.Chatter_Box_Starter.entities.Comment;
import com.DanielsProjects1.Chatter_Box_Starter.entities.CommentStatus;
import com.DanielsProjects1.Chatter_Box_Starter.entities.User;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public class CommentDTO {
    private UUID id;
    private String body;
    private UserDTO author;
    private UUID parentId;
    private Instant createdDate;
    private CommentStatus status;
    private long replyCount;

    public static CommentDTO from(Comment comment, long replyCount) {
        CommentDTO dto = new CommentDTO();
        dto.id = comment.getId();
        dto.body = comment.getBody();
        dto.author = UserDTO.from(comment.getAuthor());
        dto.parentId = comment.getParent() != null ? comment.getParent().getId() : null;
        dto.createdDate = comment.getCreatedAt();
        dto.status = comment.getStatus();
        dto.replyCount = replyCount;
        return dto;
    }
}
