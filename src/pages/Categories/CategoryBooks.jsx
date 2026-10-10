import { useEffect, useMemo, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { apiFetch } from "../../utils/api";
import { filterBooks } from "../../utils/filterBooks";
import PageHeader from "../../components/PageHeader/PageHeader";
import StatusMessage from "../../components/StatusMessage/StatusMessage";
import BookGrid from "../../components/BookGrid/BookGrid";
import BookGridSkeleton from "../../components/BookGrid/BookGridSkeleton";

// The books inside one category. "uncategorised" is the special id for books with no category.
export default function CategoryBooks() {
  const { categoryId } = useParams();
  const { query, filter, clearSearch, favoriteIds, toggleFavorite } = useOutletContext();
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
        if (err.status !== 401) setError("Could not load this category. Please try again.");
      })
      .finally(() => setLoading(false));
  }, []);

  const isUncategorised = categoryId === "uncategorised";
  const categoryName = isUncategorised
    ? "Uncategorised"
    : categories.find((c) => String(c.id) === categoryId)?.name;

  const inCategory = useMemo(
    () =>
      books.filter((b) => (isUncategorised ? !b.category_id : String(b.category_id) === categoryId)),
    [books, categoryId, isUncategorised]
  );
  const visible = useMemo(() => filterBooks(inCategory, query, filter), [inCategory, query, filter]);

  const back = { to: "/categories", label: "Categories", onClick: clearSearch };
  const notFound = !loading && !error && !categoryName;

  if (notFound) {
    return (
      <div className="categories">
        <PageHeader title="Category not found" backTo={back} />
        <StatusMessage>
          This category doesn&apos;t exist any more.
          <br />
          <Link to="/categories" onClick={clearSearch}>
            Browse all categories
          </Link>
        </StatusMessage>
      </div>
    );
  }

  return (
    <div className="categories">
      <PageHeader
        title={categoryName || "Category"}
        subtitle={
          !loading && !error ? `${visible.length} ${visible.length === 1 ? "book" : "books"}` : ""
        }
        backTo={back}
      />

      {loading && <BookGridSkeleton />}
      {error && <StatusMessage variant="error">{error}</StatusMessage>}

      {!loading && !error && visible.length === 0 && (
        <StatusMessage>
          {inCategory.length === 0 ? "There are no books in this category yet." : "No books match your search."}
        </StatusMessage>
      )}

      {!loading && !error && visible.length > 0 && (
        <BookGrid books={visible} favoriteIds={favoriteIds} onToggleFavorite={toggleFavorite} />
      )}
    </div>
  );
}
