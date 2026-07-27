package com.DanielsProjects1.Chatter_Box_Starter.controller;

import com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs.SetUsernameRequest;
import com.DanielsProjects1.Chatter_Box_Starter.dto.UserDTO;
import com.DanielsProjects1.Chatter_Box_Starter.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/me")
    public ResponseEntity<UserDTO> getUser(@RequestBody UserDTO userDTO) {}

    @PostMapping("/me/username")
    public ResponseEntity<UserDTO> setUsername(
            @AuthenticationPrincipal Jwt jwt,
            @RequestBody SetUsernameRequest request
    ) {
        UUID userId = UUID.fromString(jwt.getSubject());

        return ResponseEntity.status(HttpStatus.CREATED).body(userService.setUsername(
                userId,
                request.username()
        ));
    }
}
