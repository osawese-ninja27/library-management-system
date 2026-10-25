import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, BookOpen } from "lucide-react";
import { requestBook } from "../../api/borrowings";
import "./BookDetail.css";
import "./BookDetailNotes.css";

export default function BookDetail({ book, onClose }) {
  const [state, setState] = useState("idle"); // idle | sending | done
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Older responses may not carry the copy counts; treat that as "no information", not "none left".
  const hasCounts = typeof book.available_copies === "number";
  const soldOut = hasCounts && book.available_copies < 1;

  async function handleRequest() {
    if (state !== "idle") return;
    setState("sending");
    setError("");
    try {
      const result = await requestBook(book.id);
      setMessage(result.message);
      setState("done");
    } catch (err) {
      // The server explains why (blocked, one at a time, no copies left...). Show it as it is.
      if (err.status !== 401) setError(err.message);
      setState("idle");
    }
  }

  return (
    <div className="detail-overlay" onMouseDown={onClose}>
      <div className="detail" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="detail__close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="detail__cover">
          {book.cover_image_url ? (
            <img src={book.cover_image_url} alt={book.title} />
          ) : (
            <BookOpen size={40} strokeWidth={1.5} />
          )}
        </div>

        <div className="detail__body">
          <h2>{book.title}</h2>
          {book.author && <p className="detail__author">by {book.author}</p>}
          <div className="detail__tags">
            {book.category_name && <span>{book.category_name}</span>}
            {book.genre && <span>{book.genre}</span>}
          </div>
          <p className="detail__description">
            {book.description || "No description has been added for this book yet."}
          </p>

          <div className="detail__request">
            {hasCounts && (
              <p className={`detail__copies ${soldOut ? "detail__copies--none" : ""}`}>
                {soldOut
                  ? "All copies are currently taken."
                  : `${book.available_copies} of ${book.total_copies} ${book.total_copies === 1 ? "copy" : "copies"} available`}
              </p>
            )}

            {state === "done" ? (
              <p className="detail__success">
                {message} <Link to="/borrowed">View my requests</Link>
              </p>
            ) : (
              <button
                type="button"
                className="detail__button"
                onClick={handleRequest}
                disabled={soldOut || state === "sending"}
              >
                {state === "sending" ? "Requesting…" : soldOut ? "Not available" : "Request this book"}
              </button>
            )}

            {/* Opens this book's note on the Notes page. */}
            <Link to={`/notes/${book.id}`} className="detail__notes">
              Notes
            </Link>

            {error && (
              <p className="detail__error" role="alert">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
