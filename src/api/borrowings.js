import { apiFetch } from "../utils/api";

// Everything the user side needs for borrowing. One file = one feature.
// Each function returns the server's JSON, or throws an ApiError whose message is safe to show.

// Ask for a book. The server decides whether it is allowed (copies left, not blocked, one at a time...).
export function requestBook(bookId) {
  return apiFetch("/api/borrowings", { method: "POST", body: { bookId } });
}

// The logged-in user's own requests and loans, newest first. Every row carries server_time.
export function getMyBorrowings() {
  return apiFetch("/api/borrowings/mine");
}
