const DAY_MS = 24 * 60 * 60 * 1000;

export function formatDateTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

// "5h 12m left" for a pending request's 24-hour hold.
export function formatHoldLeft(expiresAt, serverNow) {
  const ms = new Date(expiresAt).getTime() - serverNow;
  if (ms <= 0) return "Hold ended";
  const minutes = Math.floor(ms / 60000);
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m left`;
}

// Works out the wording and whether it is overdue, using SERVER time.
export function getDueStatus(dueDate, serverNow) {
  const ms = new Date(dueDate).getTime() - serverNow;
  if (ms < 0) {
    const days = Math.max(1, Math.ceil(-ms / DAY_MS));
    return { text: `Overdue by ${days} day${days === 1 ? "" : "s"}`, overdue: true };
  }
  const days = Math.ceil(ms / DAY_MS);
  return { text: `${days} day${days === 1 ? "" : "s"} left`, overdue: false };
}

export function capitalise(word) {
  return word ? word.charAt(0).toUpperCase() + word.slice(1) : "";
}
