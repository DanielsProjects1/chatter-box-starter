package com.DanielsProjects1.Chatter_Box_Starter.filter;

import com.DanielsProjects1.Chatter_Box_Starter.service.UserService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

@Component
public class UserSyncFilter extends OncePerRequestFilter {
    private final UserService userService;

    public UserSyncFilter(UserService userService){
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain filterChain) throws ServletException, IOException {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof Jwt jwt) {
            UUID userId = UUID.fromString(jwt.getSubject());
            String email = jwt.getClaimAsString("email");
            String username = jwt.getClaimAsString("preferred_username");
            userService.syncUser(userId, email, username);
        }
        filterChain.doFilter(req, res);
    }

}
