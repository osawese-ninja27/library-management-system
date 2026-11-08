import { useEffect } from "react";
import "./AlertDialog.css";

// The popup card: a title, one short message and a single Close button.
export default function AlertDialog({ message, onClose }) {
  // Pressing Escape closes it too.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="alert-dialog__backdrop" onClick={onClose}>
      <div
        className="alert-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-message"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="alert-dialog-title" className="alert-dialog__title">
          ALERT
        </h2>
        <p id="alert-dialog-message" className="alert-dialog__message">
          {message}
        </p>
        <button type="button" className="alert-dialog__close" onClick={onClose} autoFocus>
          Close
        </button>
      </div>
    </div>
  );
}
