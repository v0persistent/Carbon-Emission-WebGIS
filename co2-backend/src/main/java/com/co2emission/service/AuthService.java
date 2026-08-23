package com.co2emission.service;

import com.co2emission.dto.LoginResponse;
import com.co2emission.entity.AppUser;
import com.co2emission.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AppUserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * 验证用户名密码，返回 JWT token + 用户信息；失败返回 null
     */
    public LoginResponse login(String username, String password) {
        AppUser user = userRepository.findByUsername(username).orElse(null);
        if (user == null || !user.getEnabled()) {
            return null;
        }
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            return null;
        }

        String token = jwtService.generateToken(user.getUsername(), user.getRole());

        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo();
        userInfo.setUsername(user.getUsername());
        userInfo.setDisplayName(user.getDisplayName());
        userInfo.setRole(user.getRole());

        return new LoginResponse(token, userInfo);
    }

    /**
     * 登出时返回当前 token 用于加入黑名单（Phase 5 启用 Redis 存储）
     */
    public String extractTokenUsername(String token) {
        return jwtService.getUsername(token);
    }
}
