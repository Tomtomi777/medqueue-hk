
package com.medqueue.hk.model;

import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

class HospitalSnapshotTest {

    @Test
    void shouldCreateHospitalSnapshot() {

        LocalDateTime time =
                LocalDateTime.of(2026, 11, 27, 10, 30);

        HospitalSnapshot hospital = new HospitalSnapshot(
                "Central Hospital",
                "10", "5",
                "20", "3",
                "1 hour", "2 hours",
                "3 hours", "4 hours",
                60, 120, 180, 240,
                time
        );

        assertEquals("Central Hospital", hospital.getHospitalName());
        assertEquals(time, hospital.getSourceUpdateTime());
    }

    @Test
    void shouldStoreWaitingTimeValues() {

        HospitalSnapshot hospital = new HospitalSnapshot(
                "Central Hospital",
                "10", "5",
                "20", "3",
                "1 hour", "2 hours",
                "3 hours", "4 hours",
                60, 120, 180, 240,
                LocalDateTime.of(2026, 11, 27, 10, 30)
        );

        assertEquals("10", hospital.getT1wt());
        assertEquals("5", hospital.getManageT1case());
        assertEquals("20", hospital.getT2wt());
        assertEquals("3", hospital.getManageT2case());
    }

    @Test
    void shouldStoreAllWaitingTimePercentiles() {

        HospitalSnapshot hospital = new HospitalSnapshot(
                "Central Hospital",
                "10", "5",
                "20", "3",
                "1 hour", "2 hours",
                "3 hours", "4 hours",
                60, 120, 180, 240,
                LocalDateTime.of(2026, 11, 27, 10, 30)
        );

        assertEquals("1 hour", hospital.getT3p50());
        assertEquals("2 hours", hospital.getT3p95());
        assertEquals("3 hours", hospital.getT45p50());
        assertEquals("4 hours", hospital.getT45p95());
    }

    @Test
    void shouldStoreConvertedMinutes() {

        HospitalSnapshot hospital = new HospitalSnapshot(
                "Central Hospital",
                "10", "5",
                "20", "3",
                "1 hour", "2 hours",
                "3 hours", "4 hours",
                60, 120, 180, 240,
                LocalDateTime.of(2026, 11, 27, 10, 30)
        );

        assertEquals(60, hospital.getT3p50Minutes());
        assertEquals(120, hospital.getT3p95Minutes());
        assertEquals(180, hospital.getT45p50Minutes());
        assertEquals(240, hospital.getT45p95Minutes());
    }

    @Test
    void shouldHaveNullIdBeforeSaving() {

        HospitalSnapshot hospital = new HospitalSnapshot(
                "Central Hospital",
                "10", "5",
                "20", "3",
                "1 hour", "2 hours",
                "3 hours", "4 hours",
                60, 120, 180, 240,
                LocalDateTime.of(2026, 11, 27, 10, 30)
        );

        assertNull(hospital.getId());
    }
}

