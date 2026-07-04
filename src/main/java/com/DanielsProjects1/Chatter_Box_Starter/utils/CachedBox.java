package com.DanielsProjects1.Chatter_Box_Starter.utils;

import java.util.UUID;

public record CachedBox(
        UUID id,
        UUID siteId,
        String pageUrl,
        boolean locked,
        boolean active
) {}
