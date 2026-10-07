import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { getToken } from "../../../utils/auth";
import "../ManageBooks/ManageBooks.css";
import "./ChangePassword.css";

const API = import.meta.env.VITE_API_URL;
const MIN_LENGTH = 8;

export default function ChangePassword() {
  const [emails, setEmails] = useState([]);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Used only to suggest emails while typing
  useEffect(() => {
    fetch(`${API}/api/users`, { headers: { Authorization: `Bearer ${getToken()}` } })
      .then((res) => (res.ok ? res.json() : []))
      .then((users) => setEmails(users.map((u) => u.email)))
      .catch(() => {});
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) return setError("Enter the user's email.");
    if (newPassword.length < MIN_LENGTH) {
      return setError(`The new password must be at least ${MIN_LENGTH} characters.`);
    }
    if (newPassword !== confirm) return setError("The two passwords do not match.");

    setSaving(true);
    try {
      const res = await fetch(`${API}/api/users/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ email: email.trim(), newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not change the password.");

      setSuccess(`Password updated for ${email.trim()}.`);
      setEmail("");
      setNewPassword("");
      setConfirm("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="change-password">
      <div className="manage-books__header">
        <div>
          <h1>Change Password</h1>
          <p>Set a new password for a user who is locked out.</p>
        </div>
      </div>

      <form className="change-password__card" onSubmit={handleSubmit}>
        {error && <p className="admin-error" role="alert">{error}</p>}
        {success && <p className="admin-success" role="status">{success}</p>}

        <label className="form-field">
          User email
          <input
            type="email"
            list="user-emails"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            autoComplete="off"
          />
          <datalist id="user-emails">
            {emails.map((m) => (
              <option key={m} value={m} />
            ))}
          </datalist>
        </label>

        <label className="form-field">
          New password
          <div className="password-input">
            <input
              type={show ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder={`At least ${MIN_LENGTH} characters`}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="password-input__toggle"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide passwords" : "Show passwords"}
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </label>

        <label className="form-field">
          Confirm new password
          <input
            type={show ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Type it again"
            autoComplete="new-password"
          />
        </label>

        <button className="admin-button" type="submit" disabled={saving}>
          {saving ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}
