import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { Library, ChevronRight } from "lucide-react";
import { apiFetch } from "../../utils/api";
import PageHeader from "../../components/PageHeader/PageHeader";
import StatusMessage from "../../components/StatusMessage/StatusMessage";
import "./Categories.css";

export default function Categories() {
  const { query, clearSearch } = useOutletContext();
  const [categories, setCategories] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([apiFetch("/api/categories"), apiFetch("/api/books")])
      .then(([categoryList, bookList]) => {
        setCategories(categoryList);
        setBooks(bookList);
      })
      .catch((err) => {
        if (err.status !== 401) setError("Could not load categories. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Each category with how many books it holds, A to Z, with "Uncategorised" last.
  const cards = useMemo(() => {
    const counts = new Map();
    let uncategorised = 0;
    for (const book of books) {
      if (book.category_id) counts.set(book.category_id, (counts.get(book.category_id) || 0) + 1);
      else uncategorised += 1;
    }

    const list = categories
      .map((c) => ({ id: String(c.id), name: c.name, count: counts.get(c.id) || 0 }))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (uncategorised > 0) list.push({ id: "uncategorised", name: "Uncategorised", count: uncategorised });
    return list;
  }, [categories, books]);

  const text = query.trim().toLowerCase();
  const visible = text ? cards.filter((c) => c.name.toLowerCase().includes(text)) : cards;

  return (
    <div className="categories">
      <PageHeader
        title="Categories"
        subtitle={
          !loading && !error ? `${visible.length} ${visible.length === 1 ? "category" : "categories"}` : ""
        }
      />

      {loading && (
        <div className="category-grid" aria-hidden="true">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="category-grid__skeleton" />
          ))}
        </div>
      )}

      {error && <StatusMessage variant="error">{error}</StatusMessage>}

      {!loading && !error && visible.length === 0 && (
        <StatusMessage>
          {cards.length === 0 ? "No categories have been added yet." : "No categories match your search."}
        </StatusMessage>
      )}

      {!loading && !error && visible.length > 0 && (
        <div className="category-grid">
          {visible.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              onClick={clearSearch}
              className={`category-card ${category.count === 0 ? "category-card--empty" : ""}`}
            >
              <span className="category-card__icon">
                <Library size={20} strokeWidth={1.7} />
              </span>
              <span className="category-card__text">
                <span className="category-card__name">{category.name}</span>
                <span className="category-card__count">
                  {category.count === 0
                    ? "No books yet"
                    : `${category.count} ${category.count === 1 ? "book" : "books"}`}
                </span>
              </span>
              <ChevronRight size={18} className="category-card__chevron" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
