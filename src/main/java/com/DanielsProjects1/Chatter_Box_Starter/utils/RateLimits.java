package com.DanielsProjects1.Chatter_Box_Starter.utils;

import java.time.Duration;

public final class RateLimits {
    private RateLimits() {}

    public static final int GLOBAL_COMMENT_LIMIT = 100;
    public static final int SITE_COMMENT_LIMIT = 30;
    public static final Duration COMMENT_WINDOW = Duration.ofMinutes(10);
}
