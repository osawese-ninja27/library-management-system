import { useEffect } from "react";
import { X, BookOpen } from "lucide-react";
import "./BookDetail.css";

export default function BookDetail({ book, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="detail-overlay" onMouseDown={onClose}>
      <div className="detail" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="detail__close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="detail__cover">
          {book.cover_image_url ? (
            <img src={book.cover_image_url} alt={book.title} />
          ) : (
            <BookOpen size={40} strokeWidth={1.5} />
          )}
        </div>

        <div className="detail__body">
          <h2>{book.title}</h2>
          {book.author && <p className="detail__author">by {book.author}</p>}
          <div className="detail__tags">
            {book.category_name && <span>{book.category_name}</span>}
            {book.genre && <span>{book.genre}</span>}
          </div>
          <p className="detail__description">
            {book.description || "No description has been added for this book yet."}
          </p>
        </div>
      </div>
    </div>
  );
}
