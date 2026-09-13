package com.example.shortly.controller;

import com.example.shortly.service.UrlService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;

@RestController
@RequiredArgsConstructor
public class RedirectController {

    private final UrlService urlService;

    @GetMapping("/{shortCode:[a-zA-Z0-9_-]+}")
    public ResponseEntity<Void> redirect(@PathVariable String shortCode) {
        String originalUrl = urlService.getOriginalUrlAndIncrementClick(shortCode);

        HttpHeaders headers = new HttpHeaders();
        headers.setLocation(URI.create(originalUrl));
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
    }
}
