
export function getHistoryFields(category) {
  return category === "3"
    ? {
        median: "t3p50Minutes",
        p95: "t3p95Minutes",
      }
    : {
        median: "t45p50Minutes",
        p95: "t45p95Minutes",
      };
}

export function parseSourceTime(value) {
  if (typeof value !== "string") {
    return NaN;
  }

  // The backend stores Hong Kong local time.
  // Add the UTC+8 offset if none is present.

  const hasTimezone =
    /(?:Z|[+-]\d{2}:\d{2})$/i.test(value);

  return Date.parse(
    hasTimezone ? value : `${value}+08:00`
  );
}

export function prepareHistory(records) {
  return records
    .map((record) => ({
      ...record,
      timestamp: parseSourceTime(
        record.sourceUpdateTime
      ),
    }))
    .filter((record) =>
      Number.isFinite(record.timestamp)
    )
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function filterHistory(records, range) {
  if (range === "all") {
    return records;
  }

  const hours = Number(range);

  const cutoff =
    Date.now() - hours * 60 * 60 * 1000;

  return records.filter(
    (record) => record.timestamp >= cutoff
  );
}

export function calculateHistoryStatistics(
  records,
  category
) {
  const fields = getHistoryFields(category);

  const values = records
    .map((record) => record[fields.median])
    .filter(
      (value) =>
        Number.isFinite(value) && value >= 0
    );

  if (values.length === 0) {
    return {
      minimum: null,
      maximum: null,
      average: null,
      latest: null,
      change: null,
      validCount: 0,
    };
  }

  const minimum = values.reduce(
    (min, value) => Math.min(min, value)
  );

  const maximum = values.reduce(
    (max, value) => Math.max(max, value)
  );

  const average =
    values.reduce(
      (sum, value) => sum + value,
      0
    ) / values.length;

  const first = values[0];
  const latest = values[values.length - 1];

  return {
    minimum,
    maximum,
    average,
    latest,
    change:
      values.length >= 2
        ? latest - first
        : null,
    validCount: values.length,
  };
}

export function formatHongKongTime(
  timestamp,
  includeDate = false
) {
  if (!Number.isFinite(timestamp)) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Hong_Kong",
    ...(includeDate
      ? {
          month: "short",
          day: "numeric",
        }
      : {}),
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date(timestamp));
}
