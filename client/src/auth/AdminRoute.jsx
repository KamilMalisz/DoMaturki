// /src/auth/AdminRoute.jsx

import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

function AdminRoute({ children }) {
  const { userData } = useContext(AuthContext);
  const location = useLocation();

  if (!userData || !userData.role || userData.role !== "admin")
    return <Navigate to="/login" state={{ from: location }} />;
  else return <>{children}</>;
}

export default AdminRoute;
