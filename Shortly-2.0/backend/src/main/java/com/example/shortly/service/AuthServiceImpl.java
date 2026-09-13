package com.example.shortly.service;

import com.example.shortly.config.JwtUtil;
import com.example.shortly.dto.request.LoginRequest;
import com.example.shortly.dto.request.RegisterRequest;
import com.example.shortly.dto.response.AuthResponse;
import com.example.shortly.exception.InvalidUrlException;
import com.example.shortly.exception.UserAlreadyExistsException;
import com.example.shortly.model.User;
import com.example.shortly.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new UserAlreadyExistsException("An account with email " + email + " already exists.");
        }

        User user = User.builder()
                .name(request.getName().trim())
                .email(email)
                .password(passwordEncoder.encode(request.getPassword()))
                .createdAt(LocalDateTime.now())
                .build();

        userRepository.save(user);
        String token = jwtUtil.generateToken(user.getEmail(), user.getName());

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidUrlException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidUrlException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getName());

        return AuthResponse.builder()
                .token(token)
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}
