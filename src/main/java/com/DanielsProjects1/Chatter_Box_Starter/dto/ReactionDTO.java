package com.DanielsProjects1.Chatter_Box_Starter.dto;

import com.DanielsProjects1.Chatter_Box_Starter.entities.Reaction;
import com.DanielsProjects1.Chatter_Box_Starter.entities.ReactionType;
import lombok.Data;

import java.util.UUID;

@Data
public class ReactionDTO {
    private ReactionType reactionType;
    private long count;
    private boolean reacted;
}
