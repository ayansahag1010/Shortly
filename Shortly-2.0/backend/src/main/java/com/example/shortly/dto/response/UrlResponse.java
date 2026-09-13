package com.example.shortly.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UrlResponse {
    private Long id;
    private String originalUrl;
    private String shortCode;
    private String shortUrl;
    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;
    private Long clickCount;
}
