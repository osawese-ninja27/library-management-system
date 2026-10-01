import { useEffect, useState } from "react";
import { getToken } from "../../../utils/auth";
import "./ManageBooks.css";

const emptyForm = { title: "", description: "", genre: "", categoryId: "" };

export default function BookFormModal({ book, onClose, onSaved }) {
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(book);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/categories`)
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setError("Could not load categories."));
  }, []);

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title || "",
        description: book.description || "",
        genre: book.genre || "",
        categoryId: book.category_id || "",
      });
    }
  }, [book]);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }

    setSaving(true);
    try {
      let coverImageUrl = book?.cover_image_url || null;

      if (coverFile) {
        const imageForm = new FormData();
        imageForm.append("image", coverFile);

        const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
          body: imageForm,
        });

        if (!uploadRes.ok) throw new Error("Image upload failed.");
        const uploadData = await uploadRes.json();
        coverImageUrl = uploadData.url;
      }

      const payload = {
        title: form.title,
        description: form.description,
        genre: form.genre,
        categoryId: form.categoryId || null,
        coverImageUrl,
      };

      const url = isEdit
        ? `${import.meta.env.VITE_API_URL}/api/books/${book.id}`
        : `${import.meta.env.VITE_API_URL}/api/books`;

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Save failed.");
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{isEdit ? "Edit book" : "Add book"}</h2>

        {error && <p className="admin-error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input name="title" value={form.title} onChange={handleChange} />
          </label>

          <label>
            Description
            <textarea name="description" value={form.description} onChange={handleChange} />
          </label>

          <label>
            Genre
            <input name="genre" value={form.genre} onChange={handleChange} />
          </label>

          <label>
            Category
            <select name="categoryId" value={form.categoryId} onChange={handleChange}>
              <option value="">Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>

          <label>
            Cover image
            <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files[0])} />
          </label>

          <div className="modal-actions">
            <button type="button" className="admin-link-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="admin-button" disabled={saving}>
              {saving ? "Saving..." : "Save book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}