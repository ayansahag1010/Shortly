package com.example.shortly.service;

import com.example.shortly.dto.request.LoginRequest;
import com.example.shortly.dto.request.RegisterRequest;
import com.example.shortly.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
