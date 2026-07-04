package com.DanielsProjects1.Chatter_Box_Starter.service;

import com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs.AddComment;
import com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs.EditComment;
import org.springframework.stereotype.Service;

@Service
public class GifValidationService {

    public void validate(AddComment request) {
        if (!request.hasGif()) {
            return;
        }
        if (isBlank(request.getGifProvider())) {
            throw new RuntimeException("GIF provider is required.");
        }
        if (isBlank(request.getGifProviderId())) {
            throw new RuntimeException("GIF provider id is required.");
        }
        String provider = request.getGifProvider().trim().toUpperCase();
        switch (provider) {
            case "GIPHY" -> validateGiphy(request);
            default -> throw new RuntimeException("Unsupported GIF provider.");
        }
    }

    public void validate(EditComment request) {
        if (!request.hasGif()) {
            return;
        }
        if (isBlank(request.getGifProvider())) {
            throw new RuntimeException("GIF provider is required.");
        }
        if (isBlank(request.getGifProviderId())) {
            throw new RuntimeException("GIF provider id is required.");
        }
        String provider = request.getGifProvider().trim().toUpperCase();
        switch (provider) {
            case "GIPHY" -> validateGiphy(request);
            default -> throw new RuntimeException("Unsupported GIF provider.");
        }
    }

    private void validateGiphy(AddComment request) {
        if (!isGiphyUrl(request.getGifUrl())) {
            throw new RuntimeException("Invalid GIPHY URL.");
        }
        if (!isBlank(request.getGifPreviewUrl())
                && !isGiphyUrl(request.getGifPreviewUrl())) {
            throw new RuntimeException("Invalid GIPHY preview URL.");
        }
    }
    private void validateGiphy(EditComment request) {
        if (!isGiphyUrl(request.getGifUrl())) {
            throw new RuntimeException("Invalid GIPHY URL.");
        }
        if (!isBlank(request.getGifPreviewUrl())
                && !isGiphyUrl(request.getGifPreviewUrl())) {
            throw new RuntimeException("Invalid GIPHY preview URL.");
        }
    }


    private boolean isGiphyUrl(String url) {
        if (isBlank(url)) {
            return false;
        }
        String lower = url.trim().toLowerCase();
        return lower.startsWith("https://media.giphy.com/")
                || lower.matches("^https://media[0-9]\\.giphy\\.com/.*");
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
