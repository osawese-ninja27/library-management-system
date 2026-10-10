import { BookOpen, Heart } from "lucide-react";
import "./BookCard.css";

// onToggleFavorite is optional: when it is not given (e.g. on the Favorites page),
// the card is shown without a heart.
export default function BookCard({ book, onClick, isFavorite = false, onToggleFavorite }) {
  return (
    <div className="book-card">
      <button type="button" className="book-card__open" onClick={() => onClick(book)}>
        <div className="book-card__cover">
          {book.cover_image_url ? (
            <img src={book.cover_image_url} alt={book.title} loading="lazy" />
          ) : (
            <BookOpen size={28} strokeWidth={1.5} />
          )}
        </div>
        <span className="book-card__title">{book.title}</span>
      </button>

      {onToggleFavorite && (
        <button
          type="button"
          className={`book-card__heart ${isFavorite ? "book-card__heart--active" : ""}`}
          onClick={() => onToggleFavorite(book.id)}
          aria-pressed={isFavorite}
          aria-label={
            isFavorite ? `Remove ${book.title} from favorites` : `Add ${book.title} to favorites`
          }
        >
          <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      )}
    </div>
  );
}
