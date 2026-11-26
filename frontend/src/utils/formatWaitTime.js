export function formatWaitTime(value) {
  if (value == null || value === "") {
    return "Unavailable";
  }

  const text = String(value).trim();

  const match = text.match(
    /^(\d+(?:\.\d+)?)\s*(minutes?|hours?)$/i
  );

  if (!match) {
    return text;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();

  const minutes = Math.round(
    unit.startsWith("hour") ? amount * 60 : amount
  );

  if (minutes === 0) {
    return "0 min";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}