import "./StatusMessage.css";

// A centred message for empty lists and errors. Children can include a link or button.
export default function StatusMessage({ variant = "empty", children }) {
  return (
    <div
      className={`status-message status-message--${variant}`}
      role={variant === "error" ? "alert" : undefined}
    >
      {children}
    </div>
  );
}
