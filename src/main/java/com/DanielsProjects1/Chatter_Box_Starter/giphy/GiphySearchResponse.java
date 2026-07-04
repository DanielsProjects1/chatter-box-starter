package com.DanielsProjects1.Chatter_Box_Starter.giphy;

import java.util.List;

public record GiphySearchResponse(
        List<GiphyGif> data
) {
    public record GiphyGif(
            String id,
            String title,
            GiphyImages images
    ) {}

    public record GiphyImages(
            GiphyImage original,
            GiphyImage fixed_height_small
    ) {}

    public record GiphyImage(
            String url
    ) {}
}
