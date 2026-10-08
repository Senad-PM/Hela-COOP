import axiosClient from "./axiosClient";

export const fetchTransactions = async () => {
  const { data } = await axiosClient.get("/transactions", { params: { limit: 200 } });
  return data; 
};