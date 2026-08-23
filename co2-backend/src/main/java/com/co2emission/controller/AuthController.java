package com.co2emission.controller;

import com.co2emission.dto.ApiResponse;
import com.co2emission.dto.LoginRequest;
import com.co2emission.dto.LoginResponse;
import com.co2emission.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse result = authService.login(request.getUsername(), request.getPassword());
        if (result == null) {
            return ApiResponse.error(401, "用户名或密码错误");
        }
        return ApiResponse.success(result);
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout() {
        // Phase 5 将 token 加入 Redis 黑名单
        return ApiResponse.success(null);
    }
}
