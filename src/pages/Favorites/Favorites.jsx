import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import { filterBooks } from "../../utils/filterBooks";
import PageHeader from "../../components/PageHeader/PageHeader";
import StatusMessage from "../../components/StatusMessage/StatusMessage";
import BookGrid from "../../components/BookGrid/BookGrid";
import BookGridSkeleton from "../../components/BookGrid/BookGridSkeleton";

// The user's favorite books. Same cards as Discover, but without the heart:
// a book is added or removed from its heart on Discover or inside a category.
export default function Favorites() {
  const { query, filter } = useOutletContext();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/favorites")
      .then(setBooks)
      .catch((err) => {
        if (err.status !== 401) setError("Could not load your favorites. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => filterBooks(books, query, filter), [books, query, filter]);

  return (
    <div className="favorites">
      <PageHeader
        title="Favorites"
        subtitle={
          !loading && !error ? `${visible.length} ${visible.length === 1 ? "book" : "books"}` : ""
        }
      />

      {loading && <BookGridSkeleton />}
      {error && <StatusMessage variant="error">{error}</StatusMessage>}

      {!loading && !error && books.length === 0 && (
        <StatusMessage>
          You haven&apos;t added any favorites yet.
          <br />
          Tap the heart on a book to save it here.
          <br />
          <Link to="/discover">Go to Discover</Link>
        </StatusMessage>
      )}

      {!loading && !error && books.length > 0 && visible.length === 0 && (
        <StatusMessage>No favorites match your search.</StatusMessage>
      )}

      {!loading && !error && visible.length > 0 && <BookGrid books={visible} />}
    </div>
  );
}
