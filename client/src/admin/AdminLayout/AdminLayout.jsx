import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";

function AdminLayout() {
  const { userData } = useContext(AuthContext);

  if (!userData) return <Navigate to="/login" />;
  else
    return (
      <div className="adminLayout">
        <div className="content">
          <Navbar></Navbar>
          <Outlet />
        </div>
      </div>
    );
}

export default AdminLayout;
