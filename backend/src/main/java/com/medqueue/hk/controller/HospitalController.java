package com.medqueue.hk.controller;

import com.medqueue.hk.model.HospitalSnapshot;
import com.medqueue.hk.service.HospitalService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = {
        "http://localhost:5173",
        "http://127.0.0.1:5173"
})
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping
    public List<HospitalSnapshot> getHospitals() {
        return hospitalService.getLatestHospitals();
    }

    @GetMapping("/history")
    public List<HospitalSnapshot> getHistory(
            @RequestParam("name") String hospitalName
    ) {
        return hospitalService.getHospitalHistory(hospitalName);
    }
}