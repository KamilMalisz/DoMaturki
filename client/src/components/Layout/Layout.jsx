import { Outlet } from "react-router-dom";
import styles from "./layout.module.css";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";

function Layout() {
  return (
    <>
      <div className={styles.layout}>
        <div className={styles.content}>
          <Navbar />
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}

export { Layout };
