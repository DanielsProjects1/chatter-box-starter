package com.DanielsProjects1.Chatter_Box_Starter.ResponseDTOs;

import com.DanielsProjects1.Chatter_Box_Starter.entities.ReactionType;
import lombok.Data;

@Data
public class ReactionDTO {
    private ReactionType reactionType;
    private long count;
    private boolean reacted;
}
