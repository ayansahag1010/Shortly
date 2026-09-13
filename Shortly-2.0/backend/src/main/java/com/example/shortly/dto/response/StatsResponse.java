package com.example.shortly.dto.response;

import lombok.*;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsResponse {
    private long totalLinks;
    private long totalClicks;
    private UrlResponse mostUsedLink;
    private List<UrlResponse> recentLinks;
}
