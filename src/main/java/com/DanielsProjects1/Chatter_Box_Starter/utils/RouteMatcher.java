package com.DanielsProjects1.Chatter_Box_Starter.utils;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class RouteMatcher {

    private static final Pattern COMMENT_POST_PATTERN = Pattern.compile(
            "^/api/v1/widget/sites/([0-9a-fA-F-]{36})/boxes/([0-9a-fA-F-]{36})/comments$"
    );

    public boolean isCommentPost(HttpServletRequest request) {
        return "POST".equals(request.getMethod())
                && COMMENT_POST_PATTERN.matcher(request.getRequestURI()).matches();
    }

    public UUID extractSiteIdFromCommentPost(HttpServletRequest request) {
        Matcher matcher = COMMENT_POST_PATTERN.matcher(request.getRequestURI());

        if (!matcher.matches()) {
            throw new IllegalArgumentException("Request is not a comment post route.");
        }

        return UUID.fromString(matcher.group(1));
    }
}
