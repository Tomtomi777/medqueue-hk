package com.medqueue.hk.controller;

import com.medqueue.hk.service.HospitalService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(HospitalController.class)
class HospitalControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private HospitalService hospitalService;

    @Test
    void shouldReturnHospitals() throws Exception {

        when(hospitalService.getLatestHospitals())
                .thenReturn(List.of());

        mockMvc.perform(get("/api/hospitals"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));

        verify(hospitalService).getLatestHospitals();
    }

    @Test
    void shouldReturnEmptyHistory() throws Exception {

        when(hospitalService.getHospitalHistory("Central Hospital"))
                .thenReturn(List.of());

        mockMvc.perform(get("/api/hospitals/history")
                        .param("name", "Central Hospital"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));

        verify(hospitalService)
                .getHospitalHistory("Central Hospital");
    }

    @Test
    void shouldReturnBadRequestWhenNameIsMissing() throws Exception {

        mockMvc.perform(get("/api/hospitals/history"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(hospitalService);
    }

    @Test
    void shouldReturnNotFoundForUnknownEndpoint() throws Exception {

        mockMvc.perform(get("/api/hospitals/unknown"))
                .andExpect(status().isNotFound());
    }
}