import axiosClient from "./axiosClient";

export const fetchSavingsAccounts = async () => {
  const { data } = await axiosClient.get("/savings", { params: { limit: 200 } });
  return data; 
};

export const createSavingsAccount = async (savingsData) => {
  const { data } = await axiosClient.post("/savings/create", savingsData);
  return data;
};