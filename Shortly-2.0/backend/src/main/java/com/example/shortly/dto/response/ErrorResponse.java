package com.example.shortly.dto.response;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponse {
    private int status;
    private String message;
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}
