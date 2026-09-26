import { useEffect, useState } from "react";
import { getToken } from "../../../utils/auth";
import "./ManageBooks.css";

export default function ManageBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/books`)
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this book?")) return;

    await await fetch(`${import.meta.env.VITE_API_URL}/api/books/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    setBooks((current) => current.filter((book) => book.id !== id));
  }

  if (loading) return <p className="admin-loading">Loading books...</p>;

  return (
    <div className="manage-books">
      <div className="manage-books__header">
        <h1>Books</h1>
        <button className="admin-button">Add Book</button>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Genre</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.category_name || "—"}</td>
              <td>{book.genre || "—"}</td>
              <td className="admin-table__actions">
                <button className="admin-link-button">Edit</button>
                <button
                  className="admin-link-button admin-link-button--danger"
                  onClick={() => handleDelete(book.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}