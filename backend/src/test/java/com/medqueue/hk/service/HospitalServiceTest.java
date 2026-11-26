
package com.medqueue.hk.service;

import com.medqueue.hk.adapter.GovernmentApiAdapter;
import com.medqueue.hk.dto.GovernmentResponseDto;
import com.medqueue.hk.dto.HospitalWaitTimeDto;
import com.medqueue.hk.model.HospitalSnapshot;
import com.medqueue.hk.repository.HospitalSnapshotRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class HospitalServiceTest {

    @Mock
    private GovernmentApiAdapter apiAdapter;

    @Mock
    private HospitalSnapshotRepository repository;

    @Mock
    private WaitTimeParser parser;

    @InjectMocks
    private HospitalService hospitalService;

    @Captor
    private ArgumentCaptor<List<HospitalSnapshot>> captor;

    private HospitalWaitTimeDto hospital;

    @BeforeEach
void setUp() {
    hospital = new HospitalWaitTimeDto(
            "Central Hospital",
            "10",
            "5",
            "20",
            "3",
            "1 hour",
            "2 hours",
            "3 hours",
            "4 hours"
    );
}

    
    // 1. Successful data refresh
    @Test
    void shouldSaveHospitalDataSuccessfully() {
        when(apiAdapter.fetchWaitingTimes()).thenReturn(
                new GovernmentResponseDto(
                        List.of(hospital),
                        "27/11/2026 10:30AM"
                )
        );

        when(repository.existsByHospitalNameAndSourceUpdateTime(
                anyString(), any()
        )).thenReturn(false);

        when(parser.toMinutes("1 hour")).thenReturn(60);
when(parser.toMinutes("2 hours")).thenReturn(120);
when(parser.toMinutes("3 hours")).thenReturn(180);
when(parser.toMinutes("4 hours")).thenReturn(240);

        hospitalService.refreshData();

        verify(repository).saveAll(captor.capture());

        List<HospitalSnapshot> saved = captor.getValue();

        assertEquals(1, saved.size());
        assertEquals("Central Hospital", saved.get(0).getHospitalName());
    }

    // 2. Empty hospital list
    @Test
    void shouldHandleEmptyHospitalList() {
        when(apiAdapter.fetchWaitingTimes()).thenReturn(
                new GovernmentResponseDto(
                        List.of(),
                        "27/11/2026 10:30AM"
                )
        );

        hospitalService.refreshData();

        verify(repository).saveAll(captor.capture());

        assertTrue(captor.getValue().isEmpty());
    }

    // 3. Null hospital object
    @Test
    void shouldSkipNullHospital() {
        when(apiAdapter.fetchWaitingTimes()).thenReturn(
                new GovernmentResponseDto(
                        java.util.Arrays.asList((HospitalWaitTimeDto) null),
                        "27/11/2026 10:30AM"
                )
        );

        hospitalService.refreshData();

        verify(repository).saveAll(captor.capture());

        assertTrue(captor.getValue().isEmpty());
    }

    // 4. Null hospital name
    @Test
    void shouldSkipHospitalWithNullName() {
        HospitalWaitTimeDto invalidHospital =
                new HospitalWaitTimeDto(
                        null, "10", "5", "20", "3",
                        "1 hour", "2 hours", "3 hours", "4 hours"
                );

        when(apiAdapter.fetchWaitingTimes()).thenReturn(
                new GovernmentResponseDto(
                        List.of(invalidHospital),
                        "27/11/2026 10:30AM"
                )
        );

        hospitalService.refreshData();

        verify(repository).saveAll(captor.capture());

        assertTrue(captor.getValue().isEmpty());
    }

    // 5. Blank hospital name
    @Test
    void shouldSkipHospitalWithBlankName() {
        HospitalWaitTimeDto invalidHospital =
                new HospitalWaitTimeDto(
                        "   ", "10", "5", "20", "3",
                        "1 hour", "2 hours", "3 hours", "4 hours"
                );

        when(apiAdapter.fetchWaitingTimes()).thenReturn(
                new GovernmentResponseDto(
                        List.of(invalidHospital),
                        "27/11/2026 10:30AM"
                )
        );

        hospitalService.refreshData();

        verify(repository).saveAll(captor.capture());

        assertTrue(captor.getValue().isEmpty());
    }

    // 6. Trim hospital name
    @Test
    void shouldTrimHospitalName() {
        HospitalWaitTimeDto hospitalWithSpaces =
                new HospitalWaitTimeDto(
                        "  Central Hospital  ",
                        "10", "5", "20", "3",
                        "1 hour", "2 hours", "3 hours", "4 hours"
                );

        when(apiAdapter.fetchWaitingTimes()).thenReturn(
                new GovernmentResponseDto(
                        List.of(hospitalWithSpaces),
                        "27/11/2026 10:30AM"
                )
        );

        when(repository.existsByHospitalNameAndSourceUpdateTime(
                anyString(), any()
        )).thenReturn(false);

        when(parser.toMinutes("1 hour")).thenReturn(60);
when(parser.toMinutes("2 hours")).thenReturn(120);
when(parser.toMinutes("3 hours")).thenReturn(180);
when(parser.toMinutes("4 hours")).thenReturn(240);

        hospitalService.refreshData();

        verify(repository).saveAll(captor.capture());

        assertEquals(
                "Central Hospital",
                captor.getValue().get(0).getHospitalName()
        );
    }

    // 7. Skip duplicate hospital
    @Test
    void shouldSkipDuplicateHospital() {
        when(apiAdapter.fetchWaitingTimes()).thenReturn(
                new GovernmentResponseDto(
                        List.of(hospital),
                        "27/11/2026 10:30AM"
                )
        );

        when(repository.existsByHospitalNameAndSourceUpdateTime(
                eq("Central Hospital"), any()
        )).thenReturn(true);

        hospitalService.refreshData();

        verify(repository).saveAll(captor.capture());

        assertTrue(captor.getValue().isEmpty());
    }

    // 8. Convert waiting times to minutes
    @Test
    void shouldConvertWaitingTimesToMinutes() {
        when(apiAdapter.fetchWaitingTimes()).thenReturn(
                new GovernmentResponseDto(
                        List.of(hospital),
                        "27/11/2026 10:30AM"
                )
        );

        when(repository.existsByHospitalNameAndSourceUpdateTime(
                anyString(), any()
        )).thenReturn(false);

        when(parser.toMinutes("1 hour")).thenReturn(60);
when(parser.toMinutes("2 hours")).thenReturn(120);
when(parser.toMinutes("3 hours")).thenReturn(180);
when(parser.toMinutes("4 hours")).thenReturn(240);

        hospitalService.refreshData();

        verify(repository).saveAll(captor.capture());

        HospitalSnapshot saved = captor.getValue().get(0);

        assertEquals(60, saved.getT3p50Minutes());
        assertEquals(120, saved.getT3p95Minutes());
        assertEquals(180, saved.getT45p50Minutes());
        assertEquals(240, saved.getT45p95Minutes());
    }

    // 9. API exception
    @Test
    void shouldHandleApiException() {
        when(apiAdapter.fetchWaitingTimes())
                .thenThrow(new RuntimeException("API error"));

        assertDoesNotThrow(() -> hospitalService.refreshData());

        verify(repository, never()).saveAll(anyList());
    }

    // 10. Invalid update date
    @Test
    void shouldHandleInvalidUpdateDate() {
        when(apiAdapter.fetchWaitingTimes()).thenReturn(
                new GovernmentResponseDto(
                        List.of(hospital),
                        "invalid date"
                )
        );

        assertDoesNotThrow(() -> hospitalService.refreshData());

        verify(repository, never()).saveAll(anyList());
    }

    // 11. Get latest hospitals
    @Test
    void shouldReturnLatestHospitals() {
        List<HospitalSnapshot> expected = List.of();

        when(repository.findLatestSnapshots()).thenReturn(expected);

        List<HospitalSnapshot> actual =
                hospitalService.getLatestHospitals();

        assertSame(expected, actual);
        verify(repository).findLatestSnapshots();
    }

    // 12. Get hospital history
    @Test
    void shouldReturnHospitalHistory() {
        List<HospitalSnapshot> expected = List.of();

        when(repository
                .findByHospitalNameOrderBySourceUpdateTimeAsc(
                        "Central Hospital"
                )).thenReturn(expected);

        List<HospitalSnapshot> actual =
                hospitalService.getHospitalHistory("Central Hospital");

        assertSame(expected, actual);

        verify(repository)
                .findByHospitalNameOrderBySourceUpdateTimeAsc(
                        "Central Hospital"
                );
    }
}
 
