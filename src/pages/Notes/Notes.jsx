import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyNotes } from "../../api/notes";
import PageHeader from "../../components/PageHeader/PageHeader";
import StatusMessage from "../../components/StatusMessage/StatusMessage";
import "@fontsource/caveat/400.css";
import "./Notes.css";

// 05/09/26 style, from the day the note was first written.
function formatShortDate(iso) {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  return `${day}/${month}/${year}`;
}

// The Notes page in the sidebar: one cell per book the user has written on, newest first.
export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    getMyNotes()
      .then((rows) => {
        if (!cancelled) setNotes(rows);
      })
      .catch((err) => {
        if (!cancelled && err.status !== 401) setError("Could not load your notes. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="notes">
      <PageHeader title="Notes" />

      {loading && <StatusMessage>Loading…</StatusMessage>}
      {error && <StatusMessage variant="error">{error}</StatusMessage>}

      {!loading && !error && notes.length === 0 && (
        <StatusMessage>
          You haven&apos;t written any notes yet.
          <br />
          <Link to="/discover">Open a book on Discover and tap Notes</Link>
        </StatusMessage>
      )}

      {notes.length > 0 && (
        <div className="notes__grid">
          {notes.map((note) => (
            <Link key={note.book_id} to={`/notes/${note.book_id}`} className="note-cell">
              <div className="note-cell__top">
                <h2 className="note-cell__title">{note.title}</h2>
                <time className="note-cell__date" dateTime={note.created_at}>
                  {formatShortDate(note.created_at)}
                </time>
              </div>
              <p className="note-cell__text">{note.preview}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
