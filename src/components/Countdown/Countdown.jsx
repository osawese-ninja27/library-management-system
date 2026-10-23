import { useEffect, useRef, useState } from "react";
import "./Countdown.css";

const DAY_MS = 24 * 60 * 60 * 1000;

function pad(n) {
  return String(n).padStart(2, "0");
}

// 24-hour clock style: hours:minutes:seconds
function formatClock(ms) {
  const total = Math.floor(ms / 1000);
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`;
}

// A live countdown to `target`, driven by the SERVER's clock, not the device's.
//  - serverTime: the server_time the API sent with the row. We work out how far the device
//    clock is from the server once, and correct every tick by that gap.
//  - hideUntilMs: stay hidden until this much time is left (the 30-day loan uses one day).
//    While hidden, `hiddenLabel` (for example the due date) is shown instead.
//  - onExpire: called once when the time runs out.
export default function Countdown({ target, serverTime, hideUntilMs = Infinity, hiddenLabel = "", onExpire }) {
  // The gap between the device clock and the server clock, measured once when this shows up.
  const [offset] = useState(() => new Date(serverTime).getTime() - Date.now());
  const targetMs = new Date(target).getTime();
  const [now, setNow] = useState(() => Date.now() + offset);
  const fired = useRef(false);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now() + offset), 1000);
    return () => clearInterval(id);
  }, [offset]);

  const left = targetMs - now;

  useEffect(() => {
    if (left <= 0 && !fired.current) {
      fired.current = true;
      onExpire?.();
    }
  }, [left, onExpire]);

  if (left <= 0) return <span className="countdown countdown--over">Time is up</span>;
  if (left > hideUntilMs) return <span className="countdown countdown--quiet">{hiddenLabel}</span>;

  // Under a day left on a loan is the point to start worrying; a hold is always under a day.
  const urgent = left < DAY_MS && hideUntilMs !== Infinity;
  return (
    <span className={`countdown ${urgent ? "countdown--urgent" : ""}`} aria-live="off">
      {formatClock(left)}
    </span>
  );
}
