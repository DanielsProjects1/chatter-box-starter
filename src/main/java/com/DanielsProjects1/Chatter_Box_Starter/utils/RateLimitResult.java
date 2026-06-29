package com.DanielsProjects1.Chatter_Box_Starter.utils;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.Duration;

public record RateLimitResult(
        boolean allowed,
        RateLimitType limitType,
        long curentCount,
        long limit,
        Duration retryAfter
) {}
