import axiosClient from "./axiosClient";

// Fetches a generous batch and lets the section filter/search client-side,
// same pattern used elsewhere in this app (Admin.jsx's user list, etc).
export const fetchSavingsAccounts = async () => {
  const { data } = await axiosClient.get("/savings", { params: { limit: 200 } });
  return data; // { total, page, limit, data: [...] }
};