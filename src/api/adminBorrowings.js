import { getToken, logout } from "../utils/auth";

// If your other API calls build the URL differently (for example VITE_API_URL already
// ends in /api), change ONLY this line so it points at /api/admin/borrowings.
const BASE = `${import.meta.env.VITE_API_URL}/api/admin/borrowings`;

// One helper that every call below goes through: adds the admin token, reads the
// JSON reply, and turns a failed reply into an Error carrying the server's message.
async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  // Token expired or invalid: send the admin back to the login page.
  if (res.status === 401) {
    logout();
    throw new Error("Your session has ended. Please log in again.");
  }
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }
  return data;
}

// tab is "pending", "borrowed" or "history"
export function getBorrowings(tab, { limit = 20, offset = 0 } = {}) {
  return request(`?tab=${tab}&limit=${limit}&offset=${offset}`);
}

export const approveBorrowing = (id) => request(`/${id}/approve`, { method: "PATCH" });
export const rejectBorrowing = (id) => request(`/${id}/reject`, { method: "PATCH" });
export const returnBorrowing = (id) => request(`/${id}/return`, { method: "PATCH" });
