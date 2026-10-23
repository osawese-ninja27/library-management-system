import { useEffect, useState } from "react";
import {
  getBorrowings,
  approveBorrowing,
  rejectBorrowing,
  returnBorrowing,
} from "../../../api/adminBorrowings";

export const PAGE_SIZE = 20;

// Loads one tab's rows and handles the actions (approve, reject, return) for it.
// Each tab file calls this once, so the loading and error logic lives in one place.
export default function useBorrowings(tab) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busyId, setBusyId] = useState(null); // row whose action is running
  const [version, setVersion] = useState(0); // bump to reload the list
  const [clockOffset, setClockOffset] = useState(0); // server time minus this device's time
  const [now, setNow] = useState(() => Date.now());

  // Re-render every 30 seconds so the countdowns stay current.
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getBorrowings(tab, {
          limit: PAGE_SIZE,
          offset: page * PAGE_SIZE,
        });
        if (cancelled) return;

        // The last row on this page was just dealt with: step back one page.
        if (data.items.length === 0 && page > 0) {
          setPage(page - 1);
          return;
        }

        setItems(data.items);
        setTotal(data.total);
        setError("");
        // Server time is the truth. Remember how far this device's clock is from it.
        if (data.items[0]) {
          setClockOffset(new Date(data.items[0].server_time).getTime() - Date.now());
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [tab, page, version]);

  // Runs an action after the admin confirms, then reloads the list.
  async function act(action, id, confirmText) {
    if (!window.confirm(confirmText)) return;
    setBusyId(id);
    setError("");
    setNotice("");
    try {
      const result = await action(id);
      setNotice(result.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
      setVersion((v) => v + 1);
    }
  }

  return {
    items,
    total,
    page,
    setPage,
    loading,
    error,
    notice,
    busyId,
    serverNow: now + clockOffset,
    approve: (id) =>
      act(approveBorrowing, id, "Confirm the person collected this book? The 30-day timer starts now."),
    reject: (id) =>
      act(rejectBorrowing, id, "Reject this request? The copy becomes available again."),
    markReturned: (id) =>
      act(returnBorrowing, id, "Mark this book as returned? The timer stops."),
  };
}
