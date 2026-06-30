package com.DanielsProjects1.Chatter_Box_Starter.utils;

import java.time.Duration;

public record RateLimitResult(
        boolean allowed,
        RateLimitType limitType,
        long currentCount,
        long limit,
        Duration retryAfter
) {}
