
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { formatMinutes } from "../utils/hospitalStatistics";

function ComparisonTooltip({
  active,
  payload,
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const hospital = payload[0].payload;

  return (
    <div className="chart-tooltip">
      <h3>{hospital.hospital}</h3>

      <div className="chart-tooltip-row">
        <span>Published median</span>

        <strong>
          {formatMinutes(hospital.median)}
        </strong>
      </div>

      <div className="chart-tooltip-row">
        <span>95th percentile</span>

        <strong>
          {formatMinutes(hospital.p95)}
        </strong>
      </div>
    </div>
  );
}

export default function ComparisonChart({
  hospitals,
  category,
}) {
  const medianField =
    category === "3"
      ? "t3p50Minutes"
      : "t45p50Minutes";

  const p95Field =
    category === "3"
      ? "t3p95Minutes"
      : "t45p95Minutes";

  const validValue = (value) =>
    Number.isFinite(value) && value >= 0
      ? value
      : null;

  const chartData = hospitals.map(
    (hospital, index) => ({
      hospital: hospital.hospitalName,
      label: `H${index + 1}`,
      median: validValue(hospital[medianField]),
      p95: validValue(hospital[p95Field]),
    })
  );

  const hasData = chartData.some(
    (hospital) =>
      hospital.median !== null ||
      hospital.p95 !== null
  );

  if (!hasData) {
    return (
      <div className="empty-state">
        No numerical waiting time data is available
        for the selected hospitals.
      </div>
    );
  }

  return (
    <div className="comparison-chart">

      <ResponsiveContainer
        width="100%"
        height={350}
      >
        <BarChart
          data={chartData}
          margin={{
            top: 15,
            right: 15,
            left: 0,
            bottom: 10,
          }}
          barGap={6}
          barCategoryGap="25%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#e0e8ec"
          />

          <XAxis
            dataKey="label"
            tick={{
              fontSize: 12,
              fill: "#71838d",
            }}
            axisLine={false}
            tickLine={false}
          />

          <YAxis
            domain={[0, "auto"]}
            tick={{
              fontSize: 11,
              fill: "#71838d",
            }}
            tickFormatter={(value) => `${value}m`}
            axisLine={false}
            tickLine={false}
            width={50}
          />

          <Tooltip
            content={<ComparisonTooltip />}
            cursor={{ fill: "#148f8508" }}
          />

          <Legend />

          <Bar
            dataKey="median"
            name="Published median"
            fill="var(--mq-chart-median)"
            radius={[6, 6, 0, 0]}
            maxBarSize={55}
          />

          <Bar
            dataKey="p95"
            name="95th percentile"
            fill="var(--mq-chart-p95)"
            radius={[6, 6, 0, 0]}
            maxBarSize={55}
          />

        </BarChart>
      </ResponsiveContainer>

      <div className="chart-hospital-key">
        {chartData.map((hospital) => (
          <div
            className="chart-key-item"
            key={hospital.hospital}
          >
            <span>{hospital.label}</span>

            <p>{hospital.hospital}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
