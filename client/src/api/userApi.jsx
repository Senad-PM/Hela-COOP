import axiosClient from "./axiosClient";

// Fetches users for the admin panel. `limit` is set high because the
// Home/Users sections currently render the whole list client-side rather
// than paging through it. If the user base grows past a few hundred,
// this should be switched to real server-side pagination instead.
export const fetchUsers = async ({ role, isActive, search } = {}) => {
  const params = { limit: 1000 };
  if (role && role !== "All roles") params.role = role.toLowerCase();
  if (isActive !== undefined) params.isActive = isActive;
  if (search) params.search = search;

  const { data } = await axiosClient.get("/user", { params });
  return data; // { total, page, limit, data: [...] }
};

// Registers a new Manager/Staff account. The backend generates a temporary
// password and emails a "set your password" link, so no password is sent.
export const registerUser = async ({ userName, email, role }) => {
  const { data } = await axiosClient.post("/user/register", {
    userName,
    email,
    role: role.toLowerCase(), // schema enum is lowercase: "manager" | "staff" | "admin"
  });
  return data; // { id, userName, email, role, isActive, message }
};