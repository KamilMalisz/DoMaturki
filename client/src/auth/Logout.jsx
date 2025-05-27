import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { BACK_END_URL } from "../constants/api";

export function Logout() {
  const navigate = useNavigate();
  const { updateUserData } = useContext(AuthContext);

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const response = await fetch(`${BACK_END_URL}/api/v1/auth/logout`, {
          method: "GET",
          credentials: "include",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          updateUserData(null);
          navigate("/");
        } else {
          console.error("Błąd podczas wylogowania:", response.statusText);
        }
      } catch (error) {
        console.error("Błąd podczas wylogowania:", error);
      }
    };

    handleLogout();
  }, [navigate, updateUserData]);

  return <div>Wylogowanie...</div>;
}
