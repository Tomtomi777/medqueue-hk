
import {
  getHistoryFields,
} from "./historyUtils";

function escapeCsv(value) {
  let text = String(value ?? "");

  // Prevent spreadsheet formula interpretation.
  if (/^[=+\-@\t\r]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

export function exportHistoryCsv(
  records,
  hospitalName,
  category
) {
  if (!records.length) {
    return;
  }

  const fields = getHistoryFields(category);

  const categoryName =
    category === "3"
      ? "Urgent (III)"
      : "Semi-urgent / Non-urgent (IV-V)";

  const headers = [
    "Hospital",
    "Source update time (HKT)",
    "Category",
    "Published median (minutes)",
    "95th percentile (minutes)",
  ];

  const rows = records.map((record) => [
    hospitalName,
    record.sourceUpdateTime,
    categoryName,
    record[fields.median],
    record[fields.p95],
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map(escapeCsv).join(",")
    )
    .join("\r\n");

  const blob = new Blob(
    ["\uFEFF", csv],
    {
      type: "text/csv;charset=utf-8;",
    }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  const safeName = hospitalName
    .replace(/[^a-z0-9]+/gi, "-")
    .toLowerCase();

  link.href = url;

  link.download =
    `medqueue-${safeName}-category-${category}.csv`;

  document.body.appendChild(link);

  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
