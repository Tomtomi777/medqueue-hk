package com.medqueue.hk.service;

import com.medqueue.hk.adapter.GovernmentApiAdapter;
import com.medqueue.hk.dto.GovernmentResponseDto;
import com.medqueue.hk.dto.HospitalWaitTimeDto;
import com.medqueue.hk.model.HospitalSnapshot;
import com.medqueue.hk.repository.HospitalSnapshotRepository;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

@Service
public class HospitalService {

    private static final Logger logger =
            LoggerFactory.getLogger(HospitalService.class);

    private static final DateTimeFormatter DATE_FORMAT =
            DateTimeFormatter.ofPattern(
                    "d/M/uuuu h:mma", Locale.ENGLISH
            );

    private final GovernmentApiAdapter apiAdapter;
    private final HospitalSnapshotRepository repository;
    private final WaitTimeParser parser;

    public HospitalService(
            GovernmentApiAdapter apiAdapter,
            HospitalSnapshotRepository repository,
            WaitTimeParser parser
    ) {
        this.apiAdapter = apiAdapter;
        this.repository = repository;
        this.parser = parser;
    }

    @Scheduled(
        initialDelay = 0,
        fixedDelayString = "${medqueue.refresh.interval}"
    )
    public synchronized void refreshData() {

        try {
            GovernmentResponseDto response =
                    apiAdapter.fetchWaitingTimes();

            LocalDateTime updateTime = LocalDateTime.parse(
                    response.updateTime().trim(),
                    DATE_FORMAT
            );

            List<HospitalSnapshot> snapshots = new ArrayList<>();

            for (HospitalWaitTimeDto hospital : response.waitTime()) {

                if (hospital == null
                        || hospital.hospName() == null
                        || hospital.hospName().isBlank()) {
                    continue;
                }

                String name = hospital.hospName().trim();

                if (repository.existsByHospitalNameAndSourceUpdateTime(
                        name, updateTime)) {
                    continue;
                }

                HospitalSnapshot snapshot = new HospitalSnapshot(
                        name,
                        hospital.t1wt(),
                        hospital.manageT1case(),
                        hospital.t2wt(),
                        hospital.manageT2case(),
                        hospital.t3p50(),
                        hospital.t3p95(),
                        hospital.t45p50(),
                        hospital.t45p95(),
                        parser.toMinutes(hospital.t3p50()),
                        parser.toMinutes(hospital.t3p95()),
                        parser.toMinutes(hospital.t45p50()),
                        parser.toMinutes(hospital.t45p95()),
                        updateTime
                );

                snapshots.add(snapshot);
            }

            repository.saveAll(snapshots);

            logger.info(
                    "Government data synchronized. {} new records saved.",
                    snapshots.size()
            );

        } catch (Exception exception) {

            logger.error(
                    "Failed to refresh government data. "
                    + "Previously stored records remain available.",
                    exception
            );
        }
    }

    public List<HospitalSnapshot> getLatestHospitals() {
        return repository.findLatestSnapshots();
    }

    public List<HospitalSnapshot> getHospitalHistory(
            String hospitalName
    ) {
        return repository
                .findByHospitalNameOrderBySourceUpdateTimeAsc(
                        hospitalName
                );
    }
}