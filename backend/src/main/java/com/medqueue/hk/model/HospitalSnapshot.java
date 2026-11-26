package com.medqueue.hk.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "hospital_snapshots",
    uniqueConstraints = @UniqueConstraint(
        columnNames = {"hospital_name", "source_update_time"}
    )
)
public class HospitalSnapshot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hospital_name", nullable = false)
    private String hospitalName;

    private String t1wt;
    private String manageT1case;
    private String t2wt;
    private String manageT2case;

    private String t3p50;
    private String t3p95;
    private String t45p50;
    private String t45p95;

    private Integer t3p50Minutes;
    private Integer t3p95Minutes;
    private Integer t45p50Minutes;
    private Integer t45p95Minutes;

    @Column(name = "source_update_time", nullable = false)
    private LocalDateTime sourceUpdateTime;

    protected HospitalSnapshot() {
    }

    public HospitalSnapshot(
            String hospitalName,
            String t1wt,
            String manageT1case,
            String t2wt,
            String manageT2case,
            String t3p50,
            String t3p95,
            String t45p50,
            String t45p95,
            Integer t3p50Minutes,
            Integer t3p95Minutes,
            Integer t45p50Minutes,
            Integer t45p95Minutes,
            LocalDateTime sourceUpdateTime
    ) {
        this.hospitalName = hospitalName;
        this.t1wt = t1wt;
        this.manageT1case = manageT1case;
        this.t2wt = t2wt;
        this.manageT2case = manageT2case;
        this.t3p50 = t3p50;
        this.t3p95 = t3p95;
        this.t45p50 = t45p50;
        this.t45p95 = t45p95;
        this.t3p50Minutes = t3p50Minutes;
        this.t3p95Minutes = t3p95Minutes;
        this.t45p50Minutes = t45p50Minutes;
        this.t45p95Minutes = t45p95Minutes;
        this.sourceUpdateTime = sourceUpdateTime;
    }

    public Long getId() {
        return id;
    }

    public String getHospitalName() {
        return hospitalName;
    }

    public String getT1wt() {
        return t1wt;
    }

    public String getManageT1case() {
        return manageT1case;
    }

    public String getT2wt() {
        return t2wt;
    }

    public String getManageT2case() {
        return manageT2case;
    }

    public String getT3p50() {
        return t3p50;
    }

    public String getT3p95() {
        return t3p95;
    }

    public String getT45p50() {
        return t45p50;
    }

    public String getT45p95() {
        return t45p95;
    }

    public Integer getT3p50Minutes() {
        return t3p50Minutes;
    }

    public Integer getT3p95Minutes() {
        return t3p95Minutes;
    }

    public Integer getT45p50Minutes() {
        return t45p50Minutes;
    }

    public Integer getT45p95Minutes() {
        return t45p95Minutes;
    }

    public LocalDateTime getSourceUpdateTime() {
        return sourceUpdateTime;
    }
}