package com.DanielsProjects1.Chatter_Box_Starter.entities;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

public enum CommentStatus {
    VISIBLE, HIDDEN, FLAGGED, DELETED, REMOVED
}