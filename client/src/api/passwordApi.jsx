import axiosClient from "./axiosClient";

export const setPassword = async (token, password) => {
  const { data } = await axiosClient.post(`/auth/reset-password/${token}`, { password });
  return data; 
};