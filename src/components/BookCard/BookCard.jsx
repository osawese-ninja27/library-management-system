import { BookOpen } from "lucide-react";
import "./BookCard.css";

export default function BookCard({ book, onClick }) {
  return (
    <button className="book-card" onClick={() => onClick(book)}>
      <div className="book-card__cover">
        {book.cover_image_url ? (
          <img src={book.cover_image_url} alt={book.title} loading="lazy" />
        ) : (
          <BookOpen size={28} strokeWidth={1.5} />
        )}
      </div>
      <span className="book-card__title">{book.title}</span>
    </button>
  );
}
