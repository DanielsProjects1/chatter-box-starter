package com.DanielsProjects1.Chatter_Box_Starter.service;

import com.DanielsProjects1.Chatter_Box_Starter.utils.RateLimitResult;
import com.DanielsProjects1.Chatter_Box_Starter.utils.RateLimitType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class RateLimitService {
    private final StringRedisTemplate redisTemplate;

    public RateLimitResult allow(String key, int limit, Duration window, RateLimitType limitType) {
        Long count = redisTemplate.opsForValue().increment(key, 1);
        if (count == null) return new RateLimitResult(false, limitType, 0, limit, window);
        if (count == 1) redisTemplate.expire(key, window);
        Long ttl = redisTemplate.getExpire(key);
        Duration retryAfter = ttl != null && ttl > 0 ? Duration.ofSeconds(ttl) : window;
        return new RateLimitResult(count <= limit, limitType, count, limit, retryAfter);
    }

    public void testRedis() {
//        RateLimitResult allowed = allow(
//                "r1:test:user:123",
//                3,
//                Duration.ofMinutes(1)
//        );
        RateLimitResult result = new RateLimitResult(true, RateLimitType.GLOBAL, 3, 10, Duration.ofSeconds(10));
        System.out.println(result.allowed());
        System.out.println(result.limitType());
    }
}
