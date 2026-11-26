package com.medqueue.hk.dto;

import java.util.List;

public record GovernmentResponseDto(
        List<HospitalWaitTimeDto> waitTime,
        String updateTime
) {
}