export function getToken() {
  return localStorage.getItem("token");
}

export function getUser() {
  const stored = localStorage.getItem("user");
  return stored ? JSON.parse(stored) : null;
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}