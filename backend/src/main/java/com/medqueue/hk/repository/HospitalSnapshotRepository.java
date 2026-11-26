package com.medqueue.hk.repository;

import com.medqueue.hk.model.HospitalSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

public interface HospitalSnapshotRepository
        extends JpaRepository<HospitalSnapshot, Long> {

    boolean existsByHospitalNameAndSourceUpdateTime(
            String hospitalName,
            LocalDateTime sourceUpdateTime
    );

    @Query("""
        SELECT h FROM HospitalSnapshot h
        WHERE h.sourceUpdateTime = (
            SELECT MAX(s.sourceUpdateTime)
            FROM HospitalSnapshot s
        )
        ORDER BY h.hospitalName
        """)
    List<HospitalSnapshot> findLatestSnapshots();

    List<HospitalSnapshot>
        findByHospitalNameOrderBySourceUpdateTimeAsc(
            String hospitalName
        );
}