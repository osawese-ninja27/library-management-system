import { useEffect, useState } from "react";
import { X, ImagePlus } from "lucide-react";
import { getToken } from "../../../utils/auth";
import "./ManageBooks.css";

function formFromBook(book) {
  return {
    title: book?.title || "",
    author: book?.author || "",
    description: book?.description || "",
    genre: book?.genre || "",
    categoryId: book?.category_id || "",
  };
}

export default function BookFormModal({ book, onClose, onSaved }) {
  const [form, setForm] = useState(() => formFromBook(book));
  const [categories, setCategories] = useState([]);
  const [coverFile, setCoverFile] = useState(null);
  const [preview, setPreview] = useState(book?.cover_image_url || "");
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
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Free the temporary preview URL when it changes or the modal closes
  useEffect(() => {
    return () => {
      if (preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setCoverFile(file);
    setPreview(URL.createObjectURL(file));
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
        author: form.author,
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
    <div className="modal-overlay" onMouseDown={onClose}>
      <form
        className="modal"
        onSubmit={handleSubmit}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="modal__header">
          <h2>{isEdit ? "Edit book" : "Add book"}</h2>
          <button type="button" className="admin-icon-button" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal__body">
          <label className="cover-drop">
            {preview ? (
              <>
                <img src={preview} alt="Cover preview" />
                <span className="cover-drop__change">Change cover</span>
              </>
            ) : (
              <>
                <ImagePlus size={26} strokeWidth={1.5} />
                <span>Upload cover image</span>
              </>
            )}
            <input type="file" accept="image/*" onChange={handleFile} />
          </label>

          <div className="modal__fields">
            {error && <p className="admin-error" role="alert">{error}</p>}

            <label className="form-field">
              Title
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Things Fall Apart" />
            </label>

            <label className="form-field">
              Author
              <input name="author" value={form.author} onChange={handleChange} placeholder="e.g. Chinua Achebe" />
            </label>

            <div className="form-field__row">
              <label className="form-field">
                Category
                <select name="categoryId" value={form.categoryId} onChange={handleChange}>
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <span className="form-field__hint">No categories yet. Add some on the Categories page first.</span>
                )}
              </label>

              <label className="form-field">
                Genre
                <input name="genre" value={form.genre} onChange={handleChange} placeholder="e.g. Historical fiction" />
              </label>
            </div>

            <label className="form-field">
              Description
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="A short summary of the book"
              />
            </label>
          </div>
        </div>

        <div className="modal__footer">
          <button type="button" className="admin-button admin-button--ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="admin-button" disabled={saving}>
            {saving ? "Saving..." : isEdit ? "Save changes" : "Add book"}
          </button>
        </div>
      </form>
    </div>
  );
}
