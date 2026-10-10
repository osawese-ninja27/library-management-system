import { getToken, logout } from "./auth";

const API_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// One place for every request to the backend:
//  - adds the base address and the login token
//  - sends and reads JSON
//  - logs the user out if the server says the login is no longer valid (401)
//  - throws an ApiError with a message that is safe to show on screen
export async function apiFetch(path, { method = "GET", body, auth = true } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError("Could not reach the server. Check your connection.", 0);
  }

  if (res.status === 401 && auth) {
    logout();
    throw new ApiError("Your session has expired. Please log in again.", 401);
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(data?.error || "Something went wrong.", res.status);
  }

  return data;
}
