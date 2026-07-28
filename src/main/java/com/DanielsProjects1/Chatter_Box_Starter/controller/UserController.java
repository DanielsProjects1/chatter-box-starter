package com.DanielsProjects1.Chatter_Box_Starter.controller;

import com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs.SetUsernameRequest;
import com.DanielsProjects1.Chatter_Box_Starter.dto.UserDTO;
import com.DanielsProjects1.Chatter_Box_Starter.service.UserService;
import com.DanielsProjects1.Chatter_Box_Starter.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

//    @PostMapping("/me")
//    public ResponseEntity<UserDTO> getUser(@RequestBody UserDTO userDTO) {}

    @PostMapping("/me/username")
    public UserDTO setUsername(
            @RequestBody SetUsernameRequest request,
            Authentication authentication
    ) {
        UUID userId = SecurityUtils.getUserId(authentication);

        return UserDTO.from(userService.setUsername(
                userId,
                request.username()
        ));
    }

    @GetMapping("/me")
    public UserDTO getCurrentUser(
            Authentication authentication
    ) {
        UUID userId = SecurityUtils.getUserId(authentication);
        return UserDTO.from(userService.getUserProfile(userId));
    }

}
