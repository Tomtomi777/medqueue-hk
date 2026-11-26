
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  getHistoryFields,
  formatHongKongTime,
} from "../utils/historyUtils";

import {
  formatMinutes,
} from "../utils/hospitalStatistics";

function HistoryTooltip({
  active,
  payload,
  label,
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const record = payload[0].payload;

  return (
    <div className="chart-tooltip">
      <h3>
        {formatHongKongTime(Number(label), true)}
        {" HKT"}
      </h3>

      <div className="chart-tooltip-row">
        <span>Published median</span>

        <strong>
          {formatMinutes(record.median)}
        </strong>
      </div>

      <div className="chart-tooltip-row">
        <span>95th percentile</span>

        <strong>
          {formatMinutes(record.p95)}
        </strong>
      </div>
    </div>
  );
}

export default function HistoryChart({
  records,
  category,
}) {
  const fields = getHistoryFields(category);

  function validValue(value) {
    return Number.isFinite(value) && value >= 0
      ? value
      : null;
  }

  const chartData = records.map((record) => ({
    timestamp: record.timestamp,
    median: validValue(record[fields.median]),
    p95: validValue(record[fields.p95]),
  }));

  const validRecords = chartData.filter(
    (record) =>
      record.median !== null ||
      record.p95 !== null
  );

  if (validRecords.length === 0) {
    return (
      <div className="empty-state">
        No numerical historical statistics
        are available for this time range.
      </div>
    );
  }

  if (validRecords.length === 1) {
    return (
      <div className="history-single-record">

        <strong>First recorded snapshot</strong>

        <div className="history-single-values">

          <div>
            <span>Published median</span>

            <h2>
              {formatMinutes(validRecords[0].median)}
            </h2>
          </div>

          <div>
            <span>95th percentile</span>

            <h2>
              {formatMinutes(validRecords[0].p95)}
            </h2>
          </div>

        </div>

        <p>
          More records are needed to display
          changes over time.
        </p>
      </div>
    );
  }

  return (
    <div className="history-chart">

      <ResponsiveContainer
        width="100%"
        height={380}
      >
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: 20,
            left: 0,
            bottom: 15,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e0e8ec"
          />

          <XAxis
            dataKey="timestamp"
            type="number"
            scale="time"
            domain={["dataMin", "dataMax"]}
            tickFormatter={(value) =>
              formatHongKongTime(value, true)
            }
            tick={{
              fontSize: 10,
              fill: "#71838d",
            }}
            minTickGap={35}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={[0, "auto"]}
            tickFormatter={(value) =>
              `${value}m`
            }
            tick={{
              fontSize: 11,
              fill: "#71838d",
            }}
            axisLine={false}
            tickLine={false}
            width={50}
          />

          <Tooltip
            content={<HistoryTooltip />}
          />

          <Legend />

          <Line
            type="linear"
            dataKey="median"
            name="Published median"
            stroke="var(--mq-chart-median)"
            strokeWidth={3}
            dot={{
              r: 3,
              fill: "var(--mq-chart-median)",
            }}
            activeDot={{ r: 6 }}
            connectNulls={false}
            isAnimationActive={false}
          />

          <Line
            type="linear"
            dataKey="p95"
            name="95th percentile"
            stroke="var(--mq-chart-p95)"
            strokeWidth={2}
            dot={{
              r: 3,
              fill: "var(--mq-chart-p95)",
            }}
            activeDot={{ r: 5 }}
            connectNulls={false}
            isAnimationActive={false}
          />

        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}
