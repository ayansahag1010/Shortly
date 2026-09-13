package com.example.shortly;

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
import com.example.shortly.service.UrlServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UrlServiceImplTest {

    @Mock
    private UrlRepository urlRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UrlServiceImpl urlService;

    private Url testUrl;
    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .name("John Doe")
                .email("john@example.com")
                .password("hashedpwd")
                .build();

        testUrl = Url.builder()
                .id(1L)
                .originalUrl("https://github.com/ayansahag1010/Shortly")
                .shortCode("short1")
                .createdAt(LocalDateTime.now())
                .clickCount(0L)
                .user(testUser)
                .build();
    }

    @Test
    void testCreateShortUrl_Success() {
        when(urlRepository.existsByShortCode(any())).thenReturn(false);
        when(urlRepository.save(any(Url.class))).thenAnswer(invocation -> {
            Url u = invocation.getArgument(0);
            u.setId(1L);
            return u;
        });

        UrlRequest request = UrlRequest.builder()
                .originalUrl("https://google.com")
                .expiresIn("NEVER")
                .build();

        UrlResponse response = urlService.createShortUrl(request, null, "http://localhost:8080");

        assertNotNull(response);
        assertEquals("https://google.com", response.getOriginalUrl());
        assertNotNull(response.getShortCode());
        assertTrue(response.getShortUrl().startsWith("http://localhost:8080/"));
        verify(urlRepository, times(1)).save(any(Url.class));
    }

    @Test
    void testCreateShortUrl_InvalidUrl() {
        UrlRequest request = UrlRequest.builder()
                .originalUrl("not-a-valid-url")
                .build();

        assertThrows(InvalidUrlException.class, () -> urlService.createShortUrl(request, null, "http://localhost:8080"));
    }

    @Test
    void testCreateShortUrl_CustomAliasAlreadyExists() {
        when(urlRepository.existsByShortCode("custom-link")).thenReturn(true);

        UrlRequest request = UrlRequest.builder()
                .originalUrl("https://example.com")
                .customAlias("custom-link")
                .build();

        assertThrows(AliasAlreadyExistsException.class, () -> urlService.createShortUrl(request, null, "http://localhost:8080"));
    }

    @Test
    void testGetOriginalUrlAndIncrementClick_Success() {
        when(urlRepository.findByShortCode("short1")).thenReturn(Optional.of(testUrl));
        when(urlRepository.save(any(Url.class))).thenReturn(testUrl);

        String original = urlService.getOriginalUrlAndIncrementClick("short1");

        assertEquals("https://github.com/ayansahag1010/Shortly", original);
        assertEquals(1L, testUrl.getClickCount());
        verify(urlRepository, times(1)).save(testUrl);
    }

    @Test
    void testGetOriginalUrl_NotFound() {
        when(urlRepository.findByShortCode("nonexistent")).thenReturn(Optional.empty());

        assertThrows(UrlNotFoundException.class, () -> urlService.getOriginalUrlAndIncrementClick("nonexistent"));
    }

    @Test
    void testGetOriginalUrl_Expired() {
        testUrl.setExpiresAt(LocalDateTime.now().minusDays(1));
        when(urlRepository.findByShortCode("short1")).thenReturn(Optional.of(testUrl));

        assertThrows(UrlExpiredException.class, () -> urlService.getOriginalUrlAndIncrementClick("short1"));
    }

    @Test
    void testDeleteUrl_Success() {
        when(urlRepository.findById(1L)).thenReturn(Optional.of(testUrl));
        doNothing().when(urlRepository).delete(testUrl);

        assertDoesNotThrow(() -> urlService.deleteUrl(1L, "john@example.com"));
        verify(urlRepository, times(1)).delete(testUrl);
    }

    @Test
    void testGetStats_Success() {
        when(urlRepository.count()).thenReturn(1L);
        when(urlRepository.sumAllClicks()).thenReturn(42L);
        when(urlRepository.findMostClickedOverall()).thenReturn(Optional.of(testUrl));
        when(urlRepository.findAllByOrderByCreatedAtDesc()).thenReturn(List.of(testUrl));

        StatsResponse stats = urlService.getStats(null, "http://localhost:8080");

        assertEquals(1L, stats.getTotalLinks());
        assertEquals(42L, stats.getTotalClicks());
        assertNotNull(stats.getMostUsedLink());
        assertEquals(1, stats.getRecentLinks().size());
    }
}
