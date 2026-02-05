import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  if (!user || !token || user.role !== "admin") {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminRoute;
