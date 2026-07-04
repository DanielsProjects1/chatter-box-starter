package com.DanielsProjects1.Chatter_Box_Starter.utils;

public record RateLimitErrorResponse(
        String error,
        RateLimitType limitType,
        long currentCount,
        long limit,
        long retryAfterSeconds
) {}
