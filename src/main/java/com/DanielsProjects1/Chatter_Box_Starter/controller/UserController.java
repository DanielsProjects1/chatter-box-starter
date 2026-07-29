package com.DanielsProjects1.Chatter_Box_Starter.controller;

import com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs.SetUsernameRequest;
import com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs.UpdateUserProfileRequest;
import com.DanielsProjects1.Chatter_Box_Starter.ResponseDTOs.UserResponse;
import com.DanielsProjects1.Chatter_Box_Starter.service.UserService;
import com.DanielsProjects1.Chatter_Box_Starter.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

//    @PostMapping("/me")
//    public ResponseEntity<UserDTO> getUser(@RequestBody UserDTO userDTO) {}

    @GetMapping("/me")
    public UserResponse getCurrentUser(
            Authentication authentication
    ) {
        UUID userId = SecurityUtils.getUserId(authentication);
        return userService.getCurrentUser(userId);
    }

    @PatchMapping("/me")
    public UserResponse updateCurrentUser(
            Authentication authentication,
            @RequestBody
            UpdateUserProfileRequest request
    ) {
        UUID userId = SecurityUtils.getUserId(authentication);
        return userService.updateProfile(userId, request);
    }

}
