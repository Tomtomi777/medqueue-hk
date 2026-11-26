
package com.medqueue.hk.repository;

import com.medqueue.hk.model.HospitalSnapshot;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class HospitalSnapshotRepositoryTest {

    @Autowired
    private HospitalSnapshotRepository repository;

    private HospitalSnapshot createHospital(
            String name,
            LocalDateTime updateTime
    ) {
        return new HospitalSnapshot(
                name,
                "10", "5",
                "20", "3",
                "1 hour", "2 hours",
                "3 hours", "4 hours",
                60, 120, 180, 240,
                updateTime
        );
    }

    @Test
    void shouldSaveHospital() {

        HospitalSnapshot hospital = createHospital(
                "Central Hospital",
                LocalDateTime.of(2026, 11, 27, 10, 0)
        );

        HospitalSnapshot saved = repository.save(hospital);

        assertNotNull(saved.getId());
        assertEquals("Central Hospital", saved.getHospitalName());
    }

    @Test
    void shouldFindExistingHospital() {

        LocalDateTime time =
                LocalDateTime.of(2026, 11, 27, 10, 0);

        repository.save(createHospital("Central Hospital", time));

        boolean exists =
                repository.existsByHospitalNameAndSourceUpdateTime(
                        "Central Hospital", time
                );

        assertTrue(exists);
    }

    @Test
    void shouldReturnFalseWhenHospitalDoesNotExist() {

        boolean exists =
                repository.existsByHospitalNameAndSourceUpdateTime(
                        "Unknown Hospital",
                        LocalDateTime.of(2026, 11, 27, 10, 0)
                );

        assertFalse(exists);
    }

    @Test
    void shouldFindLatestSnapshots() {

        LocalDateTime oldTime =
                LocalDateTime.of(2026, 11, 26, 10, 0);

        LocalDateTime newTime =
                LocalDateTime.of(2026, 11, 27, 10, 0);

        repository.save(createHospital("Old Hospital", oldTime));
        repository.save(createHospital("Central Hospital", newTime));

        List<HospitalSnapshot> result =
                repository.findLatestSnapshots();

        assertEquals(1, result.size());
        assertEquals("Central Hospital",
                result.get(0).getHospitalName());
    }

    @Test
    void shouldSortLatestSnapshotsByHospitalName() {

        LocalDateTime time =
                LocalDateTime.of(2026, 11, 27, 10, 0);

        repository.save(createHospital("Western Hospital", time));
        repository.save(createHospital("Central Hospital", time));
        repository.save(createHospital("Eastern Hospital", time));

        List<HospitalSnapshot> result =
                repository.findLatestSnapshots();

        assertEquals(3, result.size());
        assertEquals("Central Hospital",
                result.get(0).getHospitalName());
        assertEquals("Eastern Hospital",
                result.get(1).getHospitalName());
        assertEquals("Western Hospital",
                result.get(2).getHospitalName());
    }

    @Test
    void shouldFindHospitalHistory() {

        LocalDateTime time =
                LocalDateTime.of(2026, 11, 27, 10, 0);

        repository.save(createHospital("Central Hospital", time));

        List<HospitalSnapshot> result =
                repository.findByHospitalNameOrderBySourceUpdateTimeAsc(
                        "Central Hospital"
                );

        assertEquals(1, result.size());
        assertEquals("Central Hospital",
                result.get(0).getHospitalName());
    }

    @Test
    void shouldSortHistoryByUpdateTime() {

        LocalDateTime first =
                LocalDateTime.of(2026, 11, 25, 10, 0);

        LocalDateTime second =
                LocalDateTime.of(2026, 11, 26, 10, 0);

        LocalDateTime third =
                LocalDateTime.of(2026, 11, 27, 10, 0);

        repository.save(createHospital("Central Hospital", third));
        repository.save(createHospital("Central Hospital", first));
        repository.save(createHospital("Central Hospital", second));

        List<HospitalSnapshot> result =
                repository.findByHospitalNameOrderBySourceUpdateTimeAsc(
                        "Central Hospital"
                );

        assertEquals(3, result.size());
        assertEquals(first, result.get(0).getSourceUpdateTime());
        assertEquals(second, result.get(1).getSourceUpdateTime());
        assertEquals(third, result.get(2).getSourceUpdateTime());
    }

    @Test
    void shouldFindMultipleHospitalsWithSameLatestTime() {

        LocalDateTime oldTime =
                LocalDateTime.of(2026, 11, 26, 10, 0);

        LocalDateTime latestTime =
                LocalDateTime.of(2026, 11, 27, 10, 0);

        repository.save(createHospital("Old Hospital", oldTime));
        repository.save(createHospital("Central Hospital", latestTime));
        repository.save(createHospital("Eastern Hospital", latestTime));

        List<HospitalSnapshot> result =
                repository.findLatestSnapshots();

        assertEquals(2, result.size());
        assertEquals("Central Hospital",
                result.get(0).getHospitalName());
        assertEquals("Eastern Hospital",
                result.get(1).getHospitalName());
    }
}

