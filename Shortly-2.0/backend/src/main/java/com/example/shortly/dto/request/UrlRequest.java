package com.example.shortly.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UrlRequest {

    @NotBlank(message = "Original URL is required")
    @Size(max = 2048, message = "URL is too long (maximum 2048 characters)")
    private String originalUrl;

    @Pattern(regexp = "^[a-zA-Z0-9_-]{3,20}$", message = "Custom alias must be 3-20 alphanumeric characters, hyphens, or underscores")
    private String customAlias;

    private String expiresIn; // NEVER, ONE_DAY, SEVEN_DAYS, THIRTY_DAYS
}
