import axiosClient from "./axiosClient";

export const fetchSavingsAccounts = async () => {
  const { data } = await axiosClient.get("/savings", { params: { limit: 200 } });
  return data; 
};

export const createSavingsAccount = async (savingsData) => {
  const { data } = await axiosClient.post("/savings/create", savingsData);
  return data;
};

export const depositMoney = async ({ accountNumber, amount }) => {
  const { data } = await axiosClient.put("/savings/deposit", { accountNumber, amount });
  return data;
};

export const withdrawMoney = async ({ accountNumber, amount }) => {
  const { data } = await axiosClient.put("/savings/withdraw", { accountNumber, amount });
  return data;
};