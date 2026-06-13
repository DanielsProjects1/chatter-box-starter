package com.DanielsProjects1.Chatter_Box_Starter.dto;

import lombok.Data;

@Data
public class CommentPermissions {
    private boolean canEdit;
    private boolean canDelete;
    private boolean canReport;
    private boolean canReact;
    private boolean canReply;
}
