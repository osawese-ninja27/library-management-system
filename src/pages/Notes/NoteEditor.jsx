import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getNote, saveNote } from "../../api/notes";
import PageHeader from "../../components/PageHeader/PageHeader";
import StatusMessage from "../../components/StatusMessage/StatusMessage";
import "@fontsource/caveat/400.css";
import "./Notes.css";

const SAVE_DELAY_MS = 1000; // wait this long after the last keystroke before saving
const RETRY_DELAY_MS = 5000; // after a failed save, try again after this long
const MAX_LENGTH = 5000; // same limit as the server

const SAVE_TEXT = {
  idle: "",
  saving: "Saving…",
  saved: "Saved",
  failed: "Couldn't save. Trying again…",
};

// One book's note: the title is filled in from the book, below it is a lined page to write on.
// It saves by itself while she types, and again when she leaves the page.
export default function NoteEditor() {
  const { bookId } = useParams();
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [loadState, setLoadState] = useState("loading"); // loading | ready | missing | error
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | failed

  // These change often and must not cause a re-render, so they live in refs.
  const latest = useRef(""); // what is in the box right now
  const savedValue = useRef(""); // what the server already has
  const timer = useRef(null);
  const saving = useRef(false);
  const alive = useRef(true); // false once she leaves the page
  const flushRef = useRef(() => {});

  const schedule = useCallback((delay) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => flushRef.current(), delay);
  }, []);

  // Sends the text to the server if it changed. Never loses text: if the save fails,
  // the text stays in the box and is sent again later.
  const flush = useCallback(async () => {
    clearTimeout(timer.current);
    if (saving.current || latest.current === savedValue.current) return;

    const value = latest.current;
    saving.current = true;
    setSaveState("saving");

    let ok = false;
    try {
      await saveNote(bookId, value);
      savedValue.current = value;
      ok = true;
    } catch (err) {
      if (err.status === 401) {
        saving.current = false;
        return; // the session ended; apiFetch is already sending her to log in
      }
      setSaveState("failed");
      if (alive.current) schedule(RETRY_DELAY_MS);
    }
    saving.current = false;

    if (ok) {
      const moreTyped = latest.current !== savedValue.current;
      setSaveState(moreTyped ? "saving" : "saved");
      if (moreTyped) schedule(alive.current ? SAVE_DELAY_MS : 0);
    }
  }, [bookId, schedule]);

  useEffect(() => {
    flushRef.current = flush;
  }, [flush]);

  // Load the book's title and any text she wrote before.
  useEffect(() => {
    let cancelled = false;
    getNote(bookId)
      .then((data) => {
        if (cancelled) return;
        setTitle(data.title);
        setText(data.content);
        latest.current = data.content;
        savedValue.current = data.content;
        setLoadState("ready");
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 404) setLoadState("missing");
        else if (err.status !== 401) setLoadState("error");
      });
    return () => {
      cancelled = true;
    };
  }, [bookId]);

  // Save when she switches tab or leaves this page.
  useEffect(() => {
    alive.current = true;
    const onHide = () => {
      if (document.visibilityState === "hidden") flushRef.current();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      alive.current = false;
      flushRef.current();
    };
  }, []);

  function handleChange(event) {
    const value = event.target.value;
    setText(value);
    latest.current = value;
    setSaveState("idle");
    schedule(SAVE_DELAY_MS);
  }

  return (
    <div className="note-page">
      <Link to="/notes" className="note-page__back">
        <ArrowLeft size={16} /> Notes
      </Link>

      {loadState === "loading" && <StatusMessage>Loading…</StatusMessage>}
      {loadState === "missing" && <StatusMessage variant="error">This book could not be found.</StatusMessage>}
      {loadState === "error" && (
        <StatusMessage variant="error">Could not open this note. Please try again.</StatusMessage>
      )}

      {loadState === "ready" && (
        <>
          <PageHeader title={title} />
          <p
            className={`note-page__status ${saveState === "failed" ? "note-page__status--failed" : ""}`}
            role="status"
            aria-live="polite"
          >
            {SAVE_TEXT[saveState]}
          </p>
          <textarea
            className="note-sheet"
            value={text}
            onChange={handleChange}
            maxLength={MAX_LENGTH}
            placeholder="Write anything…"
            aria-label={`Notes on ${title}`}
            spellCheck
          />
        </>
      )}
    </div>
  );
}
