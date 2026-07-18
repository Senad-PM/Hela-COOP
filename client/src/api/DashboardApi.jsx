import axiosClient from "./axiosClient";

// Note: the backend route is genuinely spelled "dashedboard" (typo baked
// into server.js's route mount) — kept as-is here to match reality rather
// than silently "fixing" it and breaking the connection.
export const fetchStaffDashboard = async () => {
  const { data } = await axiosClient.get("/dashedboard/staff");
  return data;
};