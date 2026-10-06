import { useCallback, useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { getToken } from "../../../utils/auth";
import "../ManageBooks/ManageBooks.css";
import "./ManageCategories.css";

const API = import.meta.env.VITE_API_URL;

export default function ManageCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    return fetch(`${API}/api/categories`)
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setError("Could not load categories."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdd(e) {
    e.preventDefault();
    setError("");
    if (!name.trim()) return;

    setSaving(true);
    try {
      const res = await fetch(`${API}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not add category.");
      setName("");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(category) {
    if (!confirm(`Delete "${category.name}"? Books in it will become uncategorised.`)) return;
    setError("");

    const res = await fetch(`${API}/api/categories/${category.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${getToken()}` },
    });

    if (!res.ok) {
      setError("Could not delete category.");
      return;
    }
    setCategories((current) => current.filter((c) => c.id !== category.id));
  }

  if (loading) return <p className="admin-loading">Loading categories...</p>;

  return (
    <div className="manage-categories">
      <div className="manage-books__header">
        <div>
          <h1>Categories</h1>
          <p>Group books so users can find them.</p>
        </div>
      </div>

      <form className="category-add" onSubmit={handleAdd}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name, e.g. Fiction"
          aria-label="Category name"
        />
        <button className="admin-button" type="submit" disabled={saving || !name.trim()}>
          <Plus size={16} /> {saving ? "Adding..." : "Add"}
        </button>
      </form>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-wrap">
        {categories.length === 0 ? (
          <p className="admin-empty">No categories yet. Add your first one above.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button
                        className="admin-icon-button admin-icon-button--danger"
                        onClick={() => handleDelete(c)}
                        aria-label={`Delete ${c.name}`}
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
    </div>
  );
}
