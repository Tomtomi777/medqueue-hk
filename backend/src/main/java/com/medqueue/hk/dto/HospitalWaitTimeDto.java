
package com.medqueue.hk.dto;

public record HospitalWaitTimeDto(
        String hospName,
        String t1wt,
        String manageT1case,
        String t2wt,
        String manageT2case,
        String t3p50,
        String t3p95,
        String t45p50,
        String t45p95
) {
}
