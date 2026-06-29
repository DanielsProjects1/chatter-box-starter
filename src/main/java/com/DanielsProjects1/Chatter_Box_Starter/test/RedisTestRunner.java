package com.DanielsProjects1.Chatter_Box_Starter.test;

import com.DanielsProjects1.Chatter_Box_Starter.service.RateLimitService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RedisTestRunner implements CommandLineRunner {
    private final RateLimitService rateLimitService;

    @Override
    public void run(String... args) {
        rateLimitService.testRedis();
    }
}
