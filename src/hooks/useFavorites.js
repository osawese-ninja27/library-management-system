import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch } from "../utils/api";

// Keeps track of which books the logged-in user has favorited.
// The heart updates instantly; if the server then refuses, the heart goes back and an error is set.
export default function useFavorites() {
  const [favoriteIds, setFavoriteIds] = useState(() => new Set());
  const [error, setError] = useState("");
  const pending = useRef(new Set()); // books with a request in flight, so double-clicks are ignored

  useEffect(() => {
    let cancelled = false;

    apiFetch("/api/favorites/ids")
      .then((ids) => {
        if (!cancelled) setFavoriteIds(new Set(ids));
      })
      .catch((err) => {
        if (!cancelled && err.status !== 401) setError("Could not load your favorites.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleFavorite = useCallback(
    async (bookId) => {
      if (pending.current.has(bookId)) return;
      pending.current.add(bookId);

      const adding = !favoriteIds.has(bookId);
      const apply = (shouldHave) =>
        setFavoriteIds((current) => {
          const next = new Set(current);
          if (shouldHave) next.add(bookId);
          else next.delete(bookId);
          return next;
        });

      apply(adding); // show the change straight away
      setError("");

      try {
        await apiFetch(`/api/favorites/${bookId}`, { method: adding ? "PUT" : "DELETE" });
      } catch (err) {
        apply(!adding); // put the heart back
        if (err.status !== 401) setError("Could not update your favorites. Please try again.");
      } finally {
        pending.current.delete(bookId);
      }
    },
    [favoriteIds]
  );

  const dismissError = useCallback(() => setError(""), []);

  return { favoriteIds, toggleFavorite, error, dismissError };
}
