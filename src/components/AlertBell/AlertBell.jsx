import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Bell } from "lucide-react";
import { getMyAlert } from "../../api/alerts";
import AlertDialog from "../AlertDialog/AlertDialog";
import "./AlertBell.css";

const CHECK_EVERY_MS = 5 * 60 * 1000; // look again every 5 minutes while the page stays open

// The bell in the top bar. With an alert it shakes until the user clicks it, and clicking
// opens the popup. The alert itself comes from the server, which works out the timing.
export default function AlertBell() {
  const [alert, setAlert] = useState(null);
  const [seenKey, setSeenKey] = useState(null); // which alert the user has already opened
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const data = await getMyAlert();
        if (!cancelled) setAlert(data.alert);
      } catch {
        // A failed check only means no alert is shown this time; the next check tries again.
      }
    }

    check();
    const timer = setInterval(check, CHECK_EVERY_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, []);

  const key = alert ? `${alert.type}-${alert.id}` : null;
  const ringing = alert !== null && seenKey !== key;

  const openAlert = () => {
    if (!alert) return;
    setSeenKey(key);
    setOpen(true);
  };

  return (
    <>
      <button
        type="button"
        className={`user-topbar__icon alert-bell ${ringing ? "alert-bell--ring" : ""}`}
        onClick={openAlert}
        aria-label={alert ? "You have an alert" : "Alerts"}
      >
        <Bell size={18} />
        {alert && <span className="alert-bell__dot" />}
      </button>

      {/* The popup is attached to the page body: the top bar has a blur effect that would
          otherwise trap a full-screen popup inside the bar. */}
      {open && alert &&
        createPortal(
          <AlertDialog message={alert.message} onClose={() => setOpen(false)} />,
          document.body
        )}
    </>
  );
}
