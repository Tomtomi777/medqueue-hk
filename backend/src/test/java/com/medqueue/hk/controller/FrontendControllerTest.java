
package com.medqueue.hk.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FrontendController.class)
class FrontendControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void shouldForwardHospitalsPage() throws Exception {

        mockMvc.perform(get("/hospitals"))
                .andExpect(status().isOk())
                .andExpect(forwardedUrl("/index.html"));
    }

    @Test
    void shouldForwardComparisonPage() throws Exception {

        mockMvc.perform(get("/comparison"))
                .andExpect(status().isOk())
                .andExpect(forwardedUrl("/index.html"));
    }

    @Test
    void shouldForwardAnalyticsPage() throws Exception {

        mockMvc.perform(get("/analytics"))
                .andExpect(status().isOk())
                .andExpect(forwardedUrl("/index.html"));
    }

    @Test
    void shouldReturnNotFoundForUnknownPage() throws Exception {

        mockMvc.perform(get("/unknown"))
                .andExpect(status().isNotFound());
    }
}
