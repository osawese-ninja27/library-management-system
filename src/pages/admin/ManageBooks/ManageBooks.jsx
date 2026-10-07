import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Pencil, Trash2, Search, BookOpen } from "lucide-react";
import { getToken } from "../../../utils/auth";
import BookFormModal from "./BookFormModal";
import "./ManageBooks.css";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const loadBooks = useCallback(() => {
    return fetch(`${import.meta.env.VITE_API_URL}/api/books`)
      .then((res) => res.json())
      .then(setBooks)
      .catch(() => setError("Could not load books."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return books;
    return books.filter((b) =>
      [b.title, b.author, b.genre, b.category_name].some((v) => (v || "").toLowerCase().includes(q))
    );
  }, [books, search]);

  async function handleDelete(id) {
    if (!confirm("Delete this book?")) return;

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/books/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!res.ok) {
      setError("Could not delete the book.");
      return;
    }

    setBooks((current) => current.filter((book) => book.id !== id));
  }

  function openAdd() {
    setEditingBook(null);
    setShowModal(true);
  }

  function openEdit(book) {
    setEditingBook(book);
    setShowModal(true);
  }

  if (loading) return <p className="admin-loading">Loading books...</p>;

  return (
    <div className="manage-books">
      <div className="manage-books__header">
        <div>
          <h1>Books</h1>
          <p>{books.length} {books.length === 1 ? "book" : "books"} in the library</p>
        </div>

        <div className="manage-books__tools">
          <label className="manage-books__search">
            <Search size={15} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books"
            />
          </label>
          <button className="admin-button" onClick={openAdd}>
            <Plus size={16} /> Add book
          </button>
        </div>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-wrap">
        {visible.length === 0 ? (
          <p className="admin-empty">
            {books.length === 0 ? "No books yet. Add your first one." : "No books match your search."}
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Category</th>
                <th>Genre</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((book) => (
                <tr key={book.id}>
                  <td>
                    <div className="admin-table__book">
                      <div className="admin-table__thumb">
                        {book.cover_image_url ? (
                          <img src={book.cover_image_url} alt="" />
                        ) : (
                          <BookOpen size={16} strokeWidth={1.5} />
                        )}
                      </div>
                      <div>
                        {book.title}
                        {book.author && <div className="admin-table__sub">{book.author}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    {book.category_name ? (
                      <span className="admin-pill">{book.category_name}</span>
                    ) : (
                      <span className="admin-muted">—</span>
                    )}
                  </td>
                  <td className="admin-muted">{book.genre || "—"}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button
                        className="admin-icon-button"
                        onClick={() => openEdit(book)}
                        aria-label={`Edit ${book.title}`}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="admin-icon-button admin-icon-button--danger"
                        onClick={() => handleDelete(book.id)}
                        aria-label={`Delete ${book.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <BookFormModal
          book={editingBook}
          onClose={() => setShowModal(false)}
          onSaved={loadBooks}
        />
      )}
    </div>
  );
}
