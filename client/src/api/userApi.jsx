import axiosClient from "./axiosClient";

export const fetchUsers = async ({ role, isActive, search } = {}) => {
  const params = { limit: 1000 };
  if (role && role !== "All roles") params.role = role.toLowerCase();
  if (isActive !== undefined) params.isActive = isActive;
  if (search) params.search = search;

  const { data } = await axiosClient.get("/user", { params });
  return data; 
};

export const registerUser = async ({ userName, email, role }) => {
  const { data } = await axiosClient.post("/user/register", {
    userName,
    email,
    role: role.toLowerCase(),
  });
  return data;
};