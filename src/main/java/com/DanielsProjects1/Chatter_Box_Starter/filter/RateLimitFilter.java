package com.DanielsProjects1.Chatter_Box_Starter.filter;

import com.DanielsProjects1.Chatter_Box_Starter.service.RateLimitService;
import com.DanielsProjects1.Chatter_Box_Starter.utils.*;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
@RequiredArgsConstructor
public class RateLimitFilter extends OncePerRequestFilter {
    private final RateLimitService rateLimitService;
    private final RouteMatcher routeMatcher;
    private final ObjectMapper objectMapper;

    @Override
    protected void doFilterInternal(
            HttpServletRequest req,
            HttpServletResponse res,
            FilterChain chain
    ) throws ServletException, IOException {

        if (!routeMatcher.isCommentPost(req)) {
            chain.doFilter(req, res);
            return;
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            chain.doFilter(req, res);
            return;
        }
        UUID userId = SecurityUtils.getUserId(auth);
        UUID siteId = routeMatcher.extractSiteIdFromCommentPost(req);
        RateLimitResult globalResult = rateLimitService.allow(
                RateLimitKeys.globalComment(userId),
                RateLimits.GLOBAL_COMMENT_LIMIT,
                RateLimits.COMMENT_WINDOW,
                RateLimitType.GLOBAL
        );
        if (!globalResult.allowed()) {
            writeRateLimitResponse(res, globalResult);
            return;
        }
        RateLimitResult siteResult = rateLimitService.allow(
                RateLimitKeys.siteComment(siteId, userId),
                RateLimits.SITE_COMMENT_LIMIT,
                RateLimits.COMMENT_WINDOW,
                RateLimitType.SITE
        );
        if (!siteResult.allowed()) {
            writeRateLimitResponse(res, siteResult);
            return;
        }
        chain.doFilter(req, res);
    }

    private void writeRateLimitResponse(HttpServletResponse res, RateLimitResult result) throws IOException {
        long retryAfterSeconds = result.retryAfter().toSeconds();
        res.setStatus(429);
        res.setContentType("application/json");
        res.setHeader("Retry-After", String.valueOf(retryAfterSeconds));
        RateLimitErrorResponse body = new RateLimitErrorResponse(
                "Too many requests. Please slow down.",
                result.limitType(),
                result.currentCount(),
                result.limit(),
                retryAfterSeconds
        );
        objectMapper.writeValue(res.getOutputStream(), body);
    }
}
