import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

function PrivateRoute({ children }) {
  const { userData } = useContext(AuthContext);
  const location = useLocation();

  if (!userData) return <Navigate to="/login" state={{ from: location }} />;
  else return <>{children}</>;
}

export default PrivateRoute;
