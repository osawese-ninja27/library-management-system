import { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import BookCard from "../../components/BookCard/BookCard";
import BookDetail from "../../components/BookDetail/BookDetail";
import "./Discover.css";

export default function Discover() {
  const { query, filter } = useOutletContext();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/books`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setBooks)
      .catch(() => setError("Could not load books. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return books;
    const field = { Title: "title", Genre: "genre", Category: "category_name" }[filter];
    return books.filter((b) => (b[field] || "").toLowerCase().includes(q));
  }, [books, query, filter]);

  return (
    <div className="discover">
      <div className="discover__header">
        <h1>Discover</h1>
        {!loading && !error && (
          <span>
            {visible.length} {visible.length === 1 ? "book" : "books"}
          </span>
        )}
      </div>

      {loading && (
        <div className="discover__grid">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="discover__skeleton" />
          ))}
        </div>
      )}

      {error && <p className="discover__error">{error}</p>}

      {!loading && !error && visible.length === 0 && (
        <p className="discover__empty">
          {books.length === 0 ? "No books have been added yet." : "No books match your search."}
        </p>
      )}

      {!loading && !error && visible.length > 0 && (
        <div className="discover__grid">
          {visible.map((book) => (
            <BookCard key={book.id} book={book} onClick={setSelected} />
          ))}
        </div>
      )}

      {selected && <BookDetail book={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
