import axiosClient from "../api/axiosClient";

const SESSION_KEYS = ["accessToken", "refreshToken", "role", "isAdmin", "token", "user"];

// Remove everything that proves the user is logged in.
export const clearSession = () => {
  SESSION_KEYS.forEach((key) => localStorage.removeItem(key));
};

// Tell the server to forget the refresh token (best effort), then clear local data.
export const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  try {
    if (refreshToken) await axiosClient.post("/auth/logout", { refreshToken });
  } catch {
    // ignore - we still log out locally
  } finally {
    clearSession();
  }
};
