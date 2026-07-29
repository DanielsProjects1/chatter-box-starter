package com.DanielsProjects1.Chatter_Box_Starter.ResponseDTOs;

import lombok.Data;

@Data
public class CommentPermissions {
    private boolean canEdit;
    private boolean canDelete;
    private boolean canReport;
    private boolean canReact;
    private boolean canReply;
    private boolean canMuteAuthor;
    private boolean canLock;
    private boolean canPin;
}
