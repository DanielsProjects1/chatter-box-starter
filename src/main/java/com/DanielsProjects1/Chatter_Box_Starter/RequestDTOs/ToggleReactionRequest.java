package com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs;

import com.DanielsProjects1.Chatter_Box_Starter.entities.ReactionType;
import lombok.Data;

@Data
public class ToggleReactionRequest {
    private ReactionType reactionType;
}
