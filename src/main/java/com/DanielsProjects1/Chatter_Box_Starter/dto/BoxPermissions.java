package com.DanielsProjects1.Chatter_Box_Starter.dto;

import lombok.Data;

@Data
public class BoxPermissions {
    private boolean canToggleBoxLock;
    private boolean canToggleBox;
    private boolean canEmptyBox;
}
