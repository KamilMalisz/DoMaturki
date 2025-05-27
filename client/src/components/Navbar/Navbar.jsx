import { useContext } from "react";
import styles from "./navbar.module.css";
import { FaUser } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import CenteredContent from "../CenteredContent/CenteredContent";
import { NavLink } from "react-router-dom";
import { BACK_END_URL } from "../../constants/api";
import AddButton from "./AddButton/AddButton";
import { isAdmin } from "../../auth/auth";
import AdminNavbar from "../../admin/components/AdminNavbar/AdminNavbar";

function Navbar() {
  const { userData } = useContext(AuthContext);
  //<div>{userData && JSON.stringify(userData)}</div>

  return (
    <CenteredContent>
      {userData && isAdmin(userData) && <AdminNavbar />}

      <nav className={styles.navbar}>
        <NavLink to={`/`}>
         {/* <img
            src={`${BACK_END_URL}/img/naszdom/logo/naszdom_logo.png`}
            className={styles.logo}
          /> */}
        </NavLink>
        <ul className={styles.navbarList}>
          {!userData && (
            <>
              <li>
                <NavLink to={`/register`}>Rejestracja</NavLink>
              </li>
              <li>
                <NavLink to={`/login`}>Logowanie</NavLink>
              </li>
            </>
          )}
          {userData && (
            <>
              <li>
                <NavLink to={`/profile/${userData._id}`}>
                  <FaUser /> Moje konto
                </NavLink>
              </li>
            </>
          )}
          <li>
            <AddButton />
          </li>
        </ul>
      </nav>
    </CenteredContent>
  );
}

export default Navbar;
