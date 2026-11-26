package com.medqueue.hk.adapter;

import com.medqueue.hk.dto.GovernmentResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import java.net.http.HttpClient;
import java.time.Duration;

@Component
public class GovernmentApiAdapter {

    private final RestClient restClient;
    private final String apiUrl;

    public GovernmentApiAdapter(
            @Value("${medqueue.api.url}") String apiUrl
    ) {
        this.apiUrl = apiUrl;

        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .followRedirects(HttpClient.Redirect.NORMAL)
                .build();

        JdkClientHttpRequestFactory factory =
                new JdkClientHttpRequestFactory(httpClient);

        factory.setReadTimeout(Duration.ofSeconds(15));

        this.restClient = RestClient.builder()
                .requestFactory(factory)
                .build();
    }

    public GovernmentResponseDto fetchWaitingTimes() {

        GovernmentResponseDto response = restClient.get()
                .uri(apiUrl)
                .retrieve()
                .body(GovernmentResponseDto.class);

        if (response == null
                || response.waitTime() == null
                || response.waitTime().isEmpty()
                || response.updateTime() == null
                || response.updateTime().isBlank()) {

            throw new IllegalStateException(
                    "Government API returned incomplete data"
            );
        }

        return response;
    }
}