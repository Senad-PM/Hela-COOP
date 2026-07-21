import axiosClient from "./axiosClient";

export const fetchStaffDashboard = async () => {
  const { data } = await axiosClient.get("/dashedboard/staff");
  return data;
};