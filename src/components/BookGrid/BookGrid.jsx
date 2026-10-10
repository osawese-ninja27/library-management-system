import { useState } from "react";
import BookCard from "../BookCard/BookCard";
import BookDetail from "../BookDetail/BookDetail";
import "./BookGrid.css";

// Shows books as a grid of cards and opens the detail popup when one is clicked.
// Pass favoriteIds and onToggleFavorite to show hearts; leave them out for no hearts.
export default function BookGrid({ books, favoriteIds, onToggleFavorite }) {
  const [selected, setSelected] = useState(null);

  return (
    <>
      <div className="book-grid">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onClick={setSelected}
            isFavorite={favoriteIds ? favoriteIds.has(book.id) : false}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {selected && <BookDetail book={selected} onClose={() => setSelected(null)} />}
    </>
  );
}
