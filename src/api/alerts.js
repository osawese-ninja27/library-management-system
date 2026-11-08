import { apiFetch } from "../utils/api";

// The alert (if any) for the logged-in user: { alert: null } or { alert: { id, type, message } }.
// One file = one feature, like the other files in this folder.
export function getMyAlert() {
  return apiFetch("/api/alerts");
}
