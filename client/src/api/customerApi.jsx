import axiosClient from "./axiosClient";

// Creates a new cooperative member. Backend generates the customerNumber
// (CUS-0001, CUS-0002, ...) and returns it — needed right after to open
// their first savings account.
export const addCustomer = async (customerData) => {
  const { data } = await axiosClient.post("/customer/add", customerData);
  return data; // { customerNumber, NIC, firstName, lastName, ... }
};

// Looks up an existing member by NIC (used when addCustomer reports the
// member already exists, so we can grab their customerNumber instead).
export const findCustomerByNIC = async (NIC) => {
  const { data } = await axiosClient.get("/customer", { params: { search: NIC } });
  return data.data?.find((c) => c.NIC === NIC) || null;
};