package com.medqueue.hk;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MedqueueApplication {

    public static void main(String[] args) {
        SpringApplication.run(
                MedqueueApplication.class, args
        );
    }
}
