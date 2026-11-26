package com.medqueue.hk.service;

import org.springframework.stereotype.Component;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class WaitTimeParser {

    private static final Pattern TIME_PATTERN =
            Pattern.compile("(\\d+(?:\\.\\d+)?)\\s*(minutes?|hours?)");

    public Integer toMinutes(String value) {

        if (value == null || value.isBlank()) {
            return null;
        }

        String normalized = value.trim().toLowerCase(Locale.ROOT);

        Matcher matcher = TIME_PATTERN.matcher(normalized);

        if (!matcher.matches()) {
            return null;
        }

        double amount = Double.parseDouble(matcher.group(1));
        String unit = matcher.group(2);

        if (unit.startsWith("hour")) {
            amount *= 60;
        }

        if (!Double.isFinite(amount) || amount > Integer.MAX_VALUE) {
            return null;
        }

        return (int) Math.round(amount);
    }
}