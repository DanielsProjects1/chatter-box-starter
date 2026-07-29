package com.DanielsProjects1.Chatter_Box_Starter.service;

import com.DanielsProjects1.Chatter_Box_Starter.entities.Box;
import com.DanielsProjects1.Chatter_Box_Starter.utils.CacheKeys;
import com.DanielsProjects1.Chatter_Box_Starter.utils.CachedBox;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
//import tools.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.Duration;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BoxCacheService {
    private final StringRedisTemplate redisTemplate;
    private final ObjectMapper objectMapper;

    public CachedBox getCachedBox(UUID siteId, String pageUrl) {
        System.out.println("Getting cached box for siteId: " + siteId);
        String json = redisTemplate.opsForValue().get(
                CacheKeys.widgetInit(siteId, pageUrl)
        );
        if (json == null) {
            System.out.println("Cache miss");
            return null;
        }
        System.out.println("Cache hit");
        try {
            return objectMapper.readValue(json, CachedBox.class);
        } catch (JsonProcessingException e) {
            redisTemplate.delete(CacheKeys.widgetInit(siteId, pageUrl));
            return null;
        }
    }

    public void cacheBox(UUID siteId, String pageUrl, Box box) {
        CachedBox cachedBox = new CachedBox(
                box.getId(),
                box.getSite().getId(),
                box.getPageUrl(),
                box.isLocked(),
                box.isActive()
        );
        try {
            String json = objectMapper.writeValueAsString(cachedBox);
            System.out.println("Saving box to Redis");
            redisTemplate.opsForValue().set(
                    CacheKeys.widgetInit(siteId, pageUrl),
                    json,
                    Duration.ofMinutes(30)
            );
        } catch (JsonProcessingException e) {
            // cache failure should not break widget init
        }
    }

    public void evictWidgetInit(UUID siteId, String pageUrl) {
        redisTemplate.delete(CacheKeys.widgetInit(siteId, pageUrl));
    }
}
