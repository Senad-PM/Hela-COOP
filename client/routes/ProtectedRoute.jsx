import { Navigate } from "react-router-dom";

// allowedRoles is optional. Omit it to just require "logged in" (any role).
// Pass e.g. ['admin'] or ['staff', 'manager'] to also restrict by role.
const ProtectedRoute = ({ children, allowedRoles }) => {
  const accessToken = localStorage.getItem('accessToken');
  const role = localStorage.getItem('role');

  if (!accessToken) {
    return <Navigate to="/" replace />;
  }
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute