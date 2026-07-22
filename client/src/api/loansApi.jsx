import axiosClient from "./axiosClient";

export const fetchLoans = async () => {
  const { data } = await axiosClient.get("/loan/loans", { params: { limit: 200 } });
  return data; 
};

export const fetchLoanStats = async () => {
  const { data } = await axiosClient.get("/loan/statics");
  return data; 
};