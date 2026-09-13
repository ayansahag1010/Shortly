package com.example.shortly;

import com.example.shortly.config.JwtUtil;
import com.example.shortly.dto.request.LoginRequest;
import com.example.shortly.dto.request.RegisterRequest;
import com.example.shortly.dto.response.AuthResponse;
import com.example.shortly.exception.InvalidUrlException;
import com.example.shortly.exception.UserAlreadyExistsException;
import com.example.shortly.model.User;
import com.example.shortly.repository.UserRepository;
import com.example.shortly.service.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthServiceImpl authService;

    private User user;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(1L)
                .name("Alice")
                .email("alice@example.com")
                .password("encoded_pass")
                .build();
    }

    @Test
    void testRegister_Success() {
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(false);
        when(passwordEncoder.encode("secret123")).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtUtil.generateToken("alice@example.com", "Alice")).thenReturn("mock-jwt-token");

        RegisterRequest request = RegisterRequest.builder()
                .name("Alice")
                .email("alice@example.com")
                .password("secret123")
                .build();

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("Alice", response.getName());
        assertEquals("alice@example.com", response.getEmail());
    }

    @Test
    void testRegister_DuplicateEmail() {
        when(userRepository.existsByEmail("alice@example.com")).thenReturn(true);

        RegisterRequest request = RegisterRequest.builder()
                .name("Alice")
                .email("alice@example.com")
                .password("secret123")
                .build();

        assertThrows(UserAlreadyExistsException.class, () -> authService.register(request));
    }

    @Test
    void testLogin_Success() {
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("secret123", "encoded_pass")).thenReturn(true);
        when(jwtUtil.generateToken("alice@example.com", "Alice")).thenReturn("mock-jwt-token");

        LoginRequest request = LoginRequest.builder()
                .email("alice@example.com")
                .password("secret123")
                .build();

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
    }

    @Test
    void testLogin_InvalidPassword() {
        when(userRepository.findByEmail("alice@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongpassword", "encoded_pass")).thenReturn(false);

        LoginRequest request = LoginRequest.builder()
                .email("alice@example.com")
                .password("wrongpassword")
                .build();

        assertThrows(InvalidUrlException.class, () -> authService.login(request));
    }
}
