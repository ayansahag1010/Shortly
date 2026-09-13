package com.example.shortly.service;

import com.example.shortly.dto.request.UrlRequest;
import com.example.shortly.dto.response.StatsResponse;
import com.example.shortly.dto.response.UrlResponse;
import com.example.shortly.exception.AliasAlreadyExistsException;
import com.example.shortly.exception.InvalidUrlException;
import com.example.shortly.exception.UrlExpiredException;
import com.example.shortly.exception.UrlNotFoundException;
import com.example.shortly.model.Url;
import com.example.shortly.model.User;
import com.example.shortly.repository.UrlRepository;
import com.example.shortly.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UrlServiceImpl implements UrlService {

    private final UrlRepository urlRepository;
    private final UserRepository userRepository;

    private static final String BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final SecureRandom RANDOM = new SecureRandom();

    @Override
    @Transactional
    public UrlResponse createShortUrl(UrlRequest request, String userEmail, String serverBaseUrl) {
        String originalUrl = request.getOriginalUrl().trim();

        if (!isValidUrl(originalUrl)) {
            throw new InvalidUrlException("Invalid URL format. Please provide a valid HTTP or HTTPS URL.");
        }

        String shortCode;
        if (request.getCustomAlias() != null && !request.getCustomAlias().trim().isEmpty()) {
            String alias = request.getCustomAlias().trim();
            if (urlRepository.existsByShortCode(alias)) {
                throw new AliasAlreadyExistsException("Custom alias '" + alias + "' is already in use.");
            }
            shortCode = alias;
        } else {
            shortCode = generateUniqueShortCode();
        }

        LocalDateTime expiresAt = calculateExpiration(request.getExpiresIn());

        User user = null;
        if (userEmail != null && !userEmail.isEmpty()) {
            user = userRepository.findByEmail(userEmail).orElse(null);
        }

        Url url = Url.builder()
                .originalUrl(originalUrl)
                .shortCode(shortCode)
                .createdAt(LocalDateTime.now())
                .expiresAt(expiresAt)
                .clickCount(0L)
                .user(user)
                .build();

        Url savedUrl = urlRepository.save(url);
        return mapToResponse(savedUrl, serverBaseUrl);
    }

    @Override
    @Transactional
    public String getOriginalUrlAndIncrementClick(String shortCode) {
        Url url = urlRepository.findByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("Short URL '" + shortCode + "' not found."));

        if (url.isExpired()) {
            throw new UrlExpiredException("This link has expired.");
        }

        url.setClickCount(url.getClickCount() + 1);
        urlRepository.save(url);
        return url.getOriginalUrl();
    }

    @Override
    @Transactional(readOnly = true)
    public List<UrlResponse> getAllUrls(String userEmail, String serverBaseUrl) {
        List<Url> urls;
        if (userEmail != null && !userEmail.isEmpty()) {
            Optional<User> userOpt = userRepository.findByEmail(userEmail);
            urls = userOpt.map(urlRepository::findByUserOrderByCreatedAtDesc)
                    .orElseGet(urlRepository::findAllByOrderByCreatedAtDesc);
        } else {
            urls = urlRepository.findAllByOrderByCreatedAtDesc();
        }

        return urls.stream()
                .map(u -> mapToResponse(u, serverBaseUrl))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public UrlResponse getUrlById(Long id, String userEmail, String serverBaseUrl) {
        Url url = urlRepository.findById(id)
                .orElseThrow(() -> new UrlNotFoundException("URL not found with id: " + id));
        return mapToResponse(url, serverBaseUrl);
    }

    @Override
    @Transactional
    public void deleteUrl(Long id, String userEmail) {
        Url url = urlRepository.findById(id)
                .orElseThrow(() -> new UrlNotFoundException("URL not found with id: " + id));
        urlRepository.delete(url);
    }

    @Override
    @Transactional(readOnly = true)
    public StatsResponse getStats(String userEmail, String serverBaseUrl) {
        long totalLinks;
        long totalClicks;
        Optional<Url> mostClickedOpt;
        List<Url> recentUrls;

        if (userEmail != null && !userEmail.isEmpty() && userRepository.existsByEmail(userEmail)) {
            User user = userRepository.findByEmail(userEmail).get();
            totalLinks = urlRepository.countByUser(user);
            Long sumClicks = urlRepository.sumClicksByUser(user);
            totalClicks = sumClicks != null ? sumClicks : 0L;
            mostClickedOpt = urlRepository.findMostClickedByUser(user);
            recentUrls = urlRepository.findByUserOrderByCreatedAtDesc(user).stream().limit(5).toList();
        } else {
            totalLinks = urlRepository.count();
            Long sumClicks = urlRepository.sumAllClicks();
            totalClicks = sumClicks != null ? sumClicks : 0L;
            mostClickedOpt = urlRepository.findMostClickedOverall();
            recentUrls = urlRepository.findAllByOrderByCreatedAtDesc().stream().limit(5).toList();
        }

        UrlResponse mostUsed = mostClickedOpt.map(u -> mapToResponse(u, serverBaseUrl)).orElse(null);
        List<UrlResponse> recentResponses = recentUrls.stream()
                .map(u -> mapToResponse(u, serverBaseUrl))
                .collect(Collectors.toList());

        return StatsResponse.builder()
                .totalLinks(totalLinks)
                .totalClicks(totalClicks)
                .mostUsedLink(mostUsed)
                .recentLinks(recentResponses)
                .build();
    }

    private String generateUniqueShortCode() {
        String code;
        int attempts = 0;
        do {
            code = generateRandomBase62(6);
            attempts++;
            if (attempts > 10) {
                code = generateRandomBase62(7);
            }
        } while (urlRepository.existsByShortCode(code));
        return code;
    }

    private String generateRandomBase62(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(BASE62_CHARS.charAt(RANDOM.nextInt(BASE62_CHARS.length())));
        }
        return sb.toString();
    }

    private LocalDateTime calculateExpiration(String expiresIn) {
        if (expiresIn == null) return null;
        return switch (expiresIn.toUpperCase()) {
            case "ONE_DAY" -> LocalDateTime.now().plusDays(1);
            case "SEVEN_DAYS" -> LocalDateTime.now().plusDays(7);
            case "THIRTY_DAYS" -> LocalDateTime.now().plusDays(30);
            default -> null;
        };
    }

    private boolean isValidUrl(String url) {
        return url.startsWith("http://") || url.startsWith("https://");
    }

    private UrlResponse mapToResponse(Url url, String serverBaseUrl) {
        String baseUrl = (serverBaseUrl != null && !serverBaseUrl.isEmpty()) ? serverBaseUrl : "http://localhost:8080";
        if (baseUrl.endsWith("/")) baseUrl = baseUrl.substring(0, baseUrl.length() - 1);

        return UrlResponse.builder()
                .id(url.getId())
                .originalUrl(url.getOriginalUrl())
                .shortCode(url.getShortCode())
                .shortUrl(baseUrl + "/" + url.getShortCode())
                .createdAt(url.getCreatedAt())
                .expiresAt(url.getExpiresAt())
                .clickCount(url.getClickCount())
                .build();
    }
}
