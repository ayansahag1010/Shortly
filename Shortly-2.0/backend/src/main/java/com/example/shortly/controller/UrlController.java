package com.example.shortly.controller;

import com.example.shortly.dto.request.UrlRequest;
import com.example.shortly.dto.response.StatsResponse;
import com.example.shortly.dto.response.UrlResponse;
import com.example.shortly.service.UrlService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;

@RestController
@RequestMapping("/api/urls")
@RequiredArgsConstructor
public class UrlController {

    private final UrlService urlService;

    @PostMapping
    public ResponseEntity<UrlResponse> createShortUrl(
            @Valid @RequestBody UrlRequest request,
            Authentication authentication,
            HttpServletRequest httpRequest) {

        String userEmail = (authentication != null) ? authentication.getName() : null;
        String baseUrl = getBaseUrl(httpRequest);

        UrlResponse response = urlService.createShortUrl(request, userEmail, baseUrl);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<UrlResponse>> getAllUrls(
            Authentication authentication,
            HttpServletRequest httpRequest) {

        String userEmail = (authentication != null) ? authentication.getName() : null;
        String baseUrl = getBaseUrl(httpRequest);

        List<UrlResponse> urls = urlService.getAllUrls(userEmail, baseUrl);
        return ResponseEntity.ok(urls);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UrlResponse> getUrlById(
            @PathVariable Long id,
            Authentication authentication,
            HttpServletRequest httpRequest) {

        String userEmail = (authentication != null) ? authentication.getName() : null;
        String baseUrl = getBaseUrl(httpRequest);

        UrlResponse url = urlService.getUrlById(id, userEmail, baseUrl);
        return ResponseEntity.ok(url);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUrl(
            @PathVariable Long id,
            Authentication authentication) {

        String userEmail = (authentication != null) ? authentication.getName() : null;
        urlService.deleteUrl(id, userEmail);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<StatsResponse> getStats(
            Authentication authentication,
            HttpServletRequest httpRequest) {

        String userEmail = (authentication != null) ? authentication.getName() : null;
        String baseUrl = getBaseUrl(httpRequest);

        StatsResponse stats = urlService.getStats(userEmail, baseUrl);
        return ResponseEntity.ok(stats);
    }

    private String getBaseUrl(HttpServletRequest request) {
        return ServletUriComponentsBuilder.fromRequestUri(request)
                .replacePath(null)
                .build()
                .toUriString();
    }
}
