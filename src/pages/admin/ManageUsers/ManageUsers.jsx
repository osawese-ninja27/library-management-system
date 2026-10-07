import { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getToken } from "../../../utils/auth";
import "../ManageBooks/ManageBooks.css";
import "./ManageUsers.css";

const API = import.meta.env.VITE_API_URL;

function fullName(u) {
  return [u.first_name, u.middle_name, u.surname].filter(Boolean).join(" ");
}

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(() => {
    return fetch(`${API}/api/users`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(setUsers)
      .catch(() => setError("Could not load users."))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.email.toLowerCase().includes(q));
  }, [users, search]);

  const blockedCount = users.filter((u) => u.is_blocked).length;

  async function toggleBlock(user) {
    const blocking = !user.is_blocked;
    const message = blocking
      ? `Block ${user.email}? They will not be able to log in.`
      : `Unblock ${user.email}?`;
    if (!confirm(message)) return;

    setError("");
    setBusyId(user.id);
    try {
      const res = await fetch(`${API}/api/users/${user.id}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ blocked: blocking }),
      });
      if (!res.ok) throw new Error();
      setUsers((current) =>
        current.map((u) => (u.id === user.id ? { ...u, is_blocked: blocking } : u))
      );
    } catch {
      setError("Could not update this user. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className="admin-loading">Loading users...</p>;

  return (
    <div className="manage-users">
      <div className="manage-books__header">
        <div>
          <h1>Users</h1>
          <p>
            {users.length} registered {users.length === 1 ? "user" : "users"}
            {blockedCount > 0 && ` · ${blockedCount} blocked`}
          </p>
        </div>

        <label className="manage-books__search">
          <Search size={15} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email"
          />
        </label>
      </div>

      {error && <p className="admin-error">{error}</p>}

      <div className="admin-table-wrap">
        {visible.length === 0 ? (
          <p className="admin-empty">
            {users.length === 0 ? "No one has registered yet." : "No users match your search."}
          </p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Status</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visible.map((user) => (
                <tr key={user.id}>
                  <td className="manage-users__email">{user.email}</td>
                  <td className="admin-muted">{fullName(user)}</td>
                  <td>
                    <span className={`status-pill ${user.is_blocked ? "status-pill--blocked" : ""}`}>
                      {user.is_blocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="admin-muted">{formatDate(user.created_at)}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button
                        className={`admin-button admin-button--small ${
                          user.is_blocked ? "admin-button--ghost" : "admin-button--danger-ghost"
                        }`}
                        onClick={() => toggleBlock(user)}
                        disabled={busyId === user.id}
                      >
                        {user.is_blocked ? "Unblock" : "Block"}
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
