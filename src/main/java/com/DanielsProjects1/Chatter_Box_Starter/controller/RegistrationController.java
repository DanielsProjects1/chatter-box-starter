package com.DanielsProjects1.Chatter_Box_Starter.controller;

import com.DanielsProjects1.Chatter_Box_Starter.RequestDTOs.RegisterUserRequest;
import com.DanielsProjects1.Chatter_Box_Starter.ResponseDTOs.UserResponse;
import com.DanielsProjects1.Chatter_Box_Starter.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/v1/register")
@RequiredArgsConstructor
public class RegistrationController {
    private final RegistrationService registrationService;

    @PostMapping()
    public ResponseEntity<UserResponse> register(
            @RequestBody RegisterUserRequest request
    ) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(registrationService.register(request));
    }
}
