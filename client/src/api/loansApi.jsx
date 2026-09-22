import axiosClient from "./axiosClient";

export const fetchLoans = async () => {
  const { data } = await axiosClient.get("/loan/loans", { params: { limit: 200 } });
  return data; 
};

export const fetchLoanStats = async () => {
  const { data } = await axiosClient.get("/loan/statics");
  return data; 
};

export const applyForLoan = async (loanData) => {
  const { data } = await axiosClient.post('/loan/create', loanData);
  return data;
};

export const approveLoan = async (loanNumber) => {
  const { data } = await axiosClient.patch(`/loan/${loanNumber}/approve`);
  return data;
};

export const rejectLoan = async (loanNumber) => {
  const { data } = await axiosClient.patch(`/loan/${loanNumber}/reject`);
  return data;
};