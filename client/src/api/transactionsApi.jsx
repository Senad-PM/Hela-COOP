import axiosClient from "./axiosClient";

// No dedicated stats endpoint exists for transactions (unlike loans, which
// has /loan/statics), so stat cards here are computed client-side from
// this same fetched batch — see the TODO note in TransactionsSection.jsx.
export const fetchTransactions = async () => {
  const { data } = await axiosClient.get("/transactions", { params: { limit: 200 } });
  return data; // { total, page, limit, data: [...] }
};