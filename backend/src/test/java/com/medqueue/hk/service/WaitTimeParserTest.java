
package com.medqueue.hk.service;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class WaitTimeParserTest {

    private final WaitTimeParser parser = new WaitTimeParser();

    // Test 1: Normal minutes
    @Test
    void testNormalMinutes() {
        assertEquals(30, parser.toMinutes("30 minutes"));
    }

    // Test 2: Singular minute
    @Test
    void testSingularMinute() {
        assertEquals(1, parser.toMinutes("1 minute"));
    }

    // Test 3: Hours conversion
    @Test
    void testHoursConversion() {
        assertEquals(120, parser.toMinutes("2 hours"));
    }

    // Test 4: Singular hour
    @Test
    void testSingularHour() {
        assertEquals(60, parser.toMinutes("1 hour"));
    }

    // Test 5: Decimal hours
    @Test
    void testDecimalHours() {
        assertEquals(90, parser.toMinutes("1.5 hours"));
    }

    // Test 6: Decimal minutes rounding
    @Test
    void testDecimalMinutes() {
        assertEquals(2, parser.toMinutes("1.5 minutes"));
    }

    // Test 7: Empty input
    @Test
    void testEmptyInput() {
        assertNull(parser.toMinutes(""));
    }

    // Test 8: Null input
    @Test
    void testNullInput() {
        assertNull(parser.toMinutes(null));
    }

    // Test 9: Uppercase input and spaces
    @Test
    void testUppercaseAndSpaces() {
        assertEquals(60, parser.toMinutes(" 1 HOUR "));
    }

    // Test 10: Invalid format
    @Test
    void testInvalidFormat() {
        assertNull(parser.toMinutes("two hours"));
    }
}
