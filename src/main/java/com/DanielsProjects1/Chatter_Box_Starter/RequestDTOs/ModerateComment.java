package com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs;

import com.DanielsProjects1.Chatter_Box_Starter.entities.CommentStatus;
import lombok.Data;

import java.util.UUID;

@Data
public class ModerateComment {
    private CommentStatus newStatus;
}
