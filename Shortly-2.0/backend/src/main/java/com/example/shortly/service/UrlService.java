package com.example.shortly.service;

import com.example.shortly.dto.request.UrlRequest;
import com.example.shortly.dto.response.StatsResponse;
import com.example.shortly.dto.response.UrlResponse;

import java.util.List;

public interface UrlService {
    UrlResponse createShortUrl(UrlRequest request, String userEmail, String serverBaseUrl);
    String getOriginalUrlAndIncrementClick(String shortCode);
    List<UrlResponse> getAllUrls(String userEmail, String serverBaseUrl);
    UrlResponse getUrlById(Long id, String userEmail, String serverBaseUrl);
    void deleteUrl(Long id, String userEmail);
    StatsResponse getStats(String userEmail, String serverBaseUrl);
}
