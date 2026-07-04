package com.DanielsProjects1.Chatter_Box_Starter.utils;

import java.util.UUID;

public final class RateLimitKeys {

    private RateLimitKeys() {}

    public static String globalComment(UUID userId) {
        return "rl:comment:global:user:" + userId;
    }

    public static String siteComment(UUID siteId, UUID userId) {
        return "rl:comment:site:" + siteId + ":user:" + userId;
    }
}
