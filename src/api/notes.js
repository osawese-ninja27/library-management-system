import { apiFetch } from "../utils/api";

// Everything the user side needs for notes. One file = one feature.
// Each function returns the server's JSON, or throws an ApiError whose message is safe to show.

// The books the user has written on, newest note first: { book_id, title, created_at, preview }
export function getMyNotes() {
  return apiFetch("/api/notes");
}

// One book's note: { book_id, title, content }. A book with no note yet has empty content.
export function getNote(bookId) {
  return apiFetch(`/api/notes/${bookId}`);
}

// Save the text of one book's note. Saving empty text removes the note.
export function saveNote(bookId, content) {
  return apiFetch(`/api/notes/${bookId}`, { method: "PUT", body: { content } });
}
