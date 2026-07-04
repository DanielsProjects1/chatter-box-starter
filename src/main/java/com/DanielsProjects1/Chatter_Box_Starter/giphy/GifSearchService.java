package com.DanielsProjects1.Chatter_Box_Starter.giphy;

//import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GifSearchService {

    private final RestClient restClient;

    @Value("${giphy.api-key}")
    private String apiKey;

    @Value("${giphy.search-url}")
    private String searchUrl;

    public List<GifResult> search(String query) {
        if (query == null || query.isBlank()) {
            return List.of();
        }

        GiphySearchResponse response = restClient.get()
                .uri(searchUrl + "?api_key={apiKey}&q={query}&limit={limit}&rating={rating}",
                        apiKey,
                        query.trim(),
                        12,
                        "pg-13")
                .retrieve()
                .body(GiphySearchResponse.class);

        if (response == null || response.data() == null) {
            return List.of();
        }

        return response.data()
                .stream()
                .map(gif -> {
                    String gifUrl = gif.images().original().url();
                    String previewUrl = gif.images().fixed_height_small().url();

                    return new GifResult(
                            gifUrl,
                            previewUrl,
                            "GIPHY",
                            gif.id(),
                            gif.title()
                    );
                })
                .filter(result -> result.gifUrl() != null && !result.gifUrl().isBlank())
                .toList();
    }
}
