import "./BookGrid.css";

// Grey placeholder cards shown while books are loading.
export default function BookGridSkeleton({ count = 10 }) {
  return (
    <div className="book-grid" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="book-grid__skeleton" />
      ))}
    </div>
  );
}
