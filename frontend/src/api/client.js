import axios from "axios";

// One place for the base URL. The interceptor adds the token to every request.
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

// ---- small helpers for the saved session (token + user) ----

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export function saveSession(token, user) {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
  window.dispatchEvent(new Event("userhub:session"));
}

export function saveUser(user) {
  localStorage.setItem("user", JSON.stringify(user));
  window.dispatchEvent(new Event("userhub:session"));
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("userhub:session"));
}

/** Server-side logout: tells Spring Boot to forget the token, then clears the browser. */
export async function logout() {
  try {
    await api.post("/auth/logout");
  } catch {
    // even if the token was already invalid, we still log out locally
  } finally {
    clearSession();
  }
}

/** Message to show for a failed request. */
export function errorMessage(err, fallback = "Something went wrong") {
  if (!err.response) return "Cannot reach the server. Is the Spring Boot backend running on port 8080?";
  return err.response.data?.error ?? fallback;
}
