const FIELD_BY_FILTER = {
  Title: "title",
  Genre: "genre",
  Category: "category_name",
};

// Keeps the books whose chosen field (Title, Genre or Category) contains the search text.
export function filterBooks(books, query, filter) {
  const text = query.trim().toLowerCase();
  if (!text) return books;

  const field = FIELD_BY_FILTER[filter] || "title";
  return books.filter((book) => (book[field] || "").toLowerCase().includes(text));
}
