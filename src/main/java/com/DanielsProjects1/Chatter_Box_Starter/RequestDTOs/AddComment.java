package com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs;

import lombok.Data;

import java.util.UUID;

@Data
public class AddComment {
    private String body;
    private String gifUrl;
    private String gifPreviewUrl;
    private String gifProvider;
    private String gifProviderId;
    private String gifTitle;
    private UUID parentId;

    public String normalizedBody() {
        return body == null ? "" : body.trim();
    }

    public boolean hasGif() {
        return gifUrl != null && !gifUrl.isBlank();
    }
}
