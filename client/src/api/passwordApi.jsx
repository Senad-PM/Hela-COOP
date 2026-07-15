import axiosClient from "./axiosClient";

// This is a public endpoint — the person isn't logged in yet when they hit
// it, so there's no accessToken to attach. axiosClient's interceptor just
// won't find one in localStorage, which is fine; the backend route itself
// doesn't require auth for this call.
export const setPassword = async (token, password) => {
  const { data } = await axiosClient.post(`/auth/reset-password/${token}`, { password });
  return data; // { message }
};