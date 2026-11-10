import axiosClient from "./axiosClient";

export const fetchStaffDashboard = async () => {
  const { data } = await axiosClient.get("/dashedboard/staff");
  return data;
};

export const fetchManagerDashboard = async () => {
  const { data } = await axiosClient.get("/dashedboard/manager");
  return data;
};