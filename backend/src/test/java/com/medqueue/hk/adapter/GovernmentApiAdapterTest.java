
package com.medqueue.hk.adapter;

import com.medqueue.hk.dto.GovernmentResponseDto;
import com.sun.net.httpserver.HttpServer;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.HttpServerErrorException;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

import static org.junit.jupiter.api.Assertions.*;

class GovernmentApiAdapterTest {

    private HttpServer server;
    private GovernmentApiAdapter adapter;

    private int responseStatus;
    private String responseBody;

    @BeforeEach
    void setUp() throws IOException {

        server = HttpServer.create(
                new InetSocketAddress("localhost", 0), 0
        );

        server.createContext("/", exchange -> {

            byte[] response = responseBody.getBytes(
                    StandardCharsets.UTF_8
            );

            exchange.getResponseHeaders().set(
                    "Content-Type", "application/json"
            );

            exchange.sendResponseHeaders(
                    responseStatus, response.length
            );

            exchange.getResponseBody().write(response);
            exchange.close();
        });

        server.start();

        String apiUrl = "http://localhost:"
                + server.getAddress().getPort();

        adapter = new GovernmentApiAdapter(apiUrl);
    }

    @AfterEach
    void tearDown() {
        server.stop(0);
    }

    @Test
    void shouldReturnWaitingTimesSuccessfully() {

        responseStatus = 200;
        responseBody = """
                {
                    "waitTime": [
                        {
                            "hospName": "Central Hospital",
                            "t1wt": "10",
                            "manageT1case": "5",
                            "t2wt": "20",
                            "manageT2case": "3",
                            "t3p50": "1 hour",
                            "t3p95": "2 hours",
                            "t45p50": "3 hours",
                            "t45p95": "4 hours"
                        }
                    ],
                    "updateTime": "27/11/2026 10:30AM"
                }
                """;

        GovernmentResponseDto result =
                adapter.fetchWaitingTimes();

        assertNotNull(result);
        assertEquals(1, result.waitTime().size());
        assertEquals(
                "Central Hospital",
                result.waitTime().get(0).hospName()
        );
        assertEquals(
                "27/11/2026 10:30AM",
                result.updateTime()
        );
    }

    @Test
    void shouldThrowExceptionWhenResponseIsNull() {

        responseStatus = 200;
        responseBody = "null";

        assertThrows(
                IllegalStateException.class,
                () -> adapter.fetchWaitingTimes()
        );
    }

    @Test
    void shouldThrowExceptionWhenWaitTimeIsNull() {

        responseStatus = 200;
        responseBody = """
                {
                    "waitTime": null,
                    "updateTime": "27/11/2026 10:30AM"
                }
                """;

        assertThrows(
                IllegalStateException.class,
                () -> adapter.fetchWaitingTimes()
        );
    }

    @Test
    void shouldThrowExceptionWhenWaitTimeIsEmpty() {

        responseStatus = 200;
        responseBody = """
                {
                    "waitTime": [],
                    "updateTime": "27/11/2026 10:30AM"
                }
                """;

        assertThrows(
                IllegalStateException.class,
                () -> adapter.fetchWaitingTimes()
        );
    }

    @Test
    void shouldThrowExceptionWhenUpdateTimeIsNull() {

        responseStatus = 200;
        responseBody = """
                {
                    "waitTime": [],
                    "updateTime": null
                }
                """;

        assertThrows(
                IllegalStateException.class,
                () -> adapter.fetchWaitingTimes()
        );
    }

    @Test
    void shouldThrowExceptionWhenUpdateTimeIsBlank() {

        responseStatus = 200;
        responseBody = """
                {
                    "waitTime": [],
                    "updateTime": "   "
                }
                """;

        assertThrows(
                IllegalStateException.class,
                () -> adapter.fetchWaitingTimes()
        );
    }

    @Test
    void shouldThrowExceptionWhenApiReturnsServerError() {

        responseStatus = 500;
        responseBody = """
                {
                    "error": "Internal Server Error"
                }
                """;

        assertThrows(
                HttpServerErrorException.class,
                () -> adapter.fetchWaitingTimes()
        );
    }
}
