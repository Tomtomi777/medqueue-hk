
import { useState } from "react";

import {
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const categories = [
  {
    number: "I",
    name: "Critical",
    description:
      "Life-threatening conditions requiring immediate attention.",
    color: "#dc4545",
  },
  {
    number: "II",
    name: "Emergency",
    description:
      "Serious conditions requiring very prompt medical attention.",
    color: "#e88b35",
  },
  {
    number: "III",
    name: "Urgent",
    description:
      "Conditions requiring urgent medical attention.",
    color: "#c69b24",
  },
  {
    number: "IV",
    name: "Semi-urgent",
    description:
      "Less urgent conditions requiring medical attention.",
    color: "#409b75",
  },
  {
    number: "V",
    name: "Non-urgent",
    description:
      "Conditions assessed as having lower immediate medical urgency.",
    color: "#4788c7",
  },
];

export default function WaitingTimeGuide() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="waiting-guide">
      <button
        className="guide-toggle"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls="waiting-guide-content"
      >
        <Info size={19} />

        <div className="guide-toggle-text">
          <strong>Understanding waiting times</strong>

          <span>
            Learn about triage categories and statistics.
          </span>
        </div>

        {expanded ? (
          <ChevronUp size={19} />
        ) : (
          <ChevronDown size={19} />
        )}
      </button>

      {expanded && (
        <div
          className="guide-content"
          id="waiting-guide-content"
        >
          <h3>What is triage?</h3>

          <p>
            Accident and Emergency departments prioritize
            patients according to the severity of their
            condition, rather than arrival order.
          </p>

          <div className="triage-grid">
            {categories.map((category) => (
              <div
                className="triage-card"
                key={category.number}
              >
                <div
                  className="triage-number"
                  style={{
                    backgroundColor: category.color,
                  }}
                >
                  {category.number}
                </div>

                <div>
                  <strong>{category.name}</strong>
                  <p>{category.description}</p>
                </div>
              </div>
            ))}
          </div>

          <h3>How to read the statistics</h3>

          <div className="statistics-guide">
            <div>
              <strong>Median (P50)</strong>

              <p>
                An estimated waiting time within which
                approximately half of patients may
                receive consultation.
              </p>
            </div>

            <div>
              <strong>95th percentile (P95)</strong>

              <p>
                An estimated waiting time within which
                approximately 95% of patients may
                receive consultation.
              </p>
            </div>
          </div>

          <div className="guide-disclaimer">
            Triage categories are determined by medical
            professionals. Published statistics are not
            guaranteed individual waiting times.
            In an emergency, call 999.
          </div>

          <a
            href="https://www.ha.org.hk/"
            target="_blank"
            rel="noopener noreferrer"
            className="guide-source"
          >
            Learn more from the Hospital Authority ↗
          </a>
        </div>
      )}
    </section>
  );
}
