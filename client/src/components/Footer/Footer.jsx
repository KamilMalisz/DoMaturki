import { NavLink } from "react-router-dom";
import CenteredContent from "../CenteredContent/CenteredContent";
import styles from "./footer.module.css";


export function Footer() {
  return (
    <footer className={styles.footer}>
      <CenteredContent>
        <div className={styles.footerContent}>
          <div className={styles.footerColumn}>
           
          </div> 
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}>  </h3>
            <ul className={styles.footerLinks}>
              <li>
                <NavLink to={"/listing/location/warszawa"}></NavLink>
              </li>
              <li>
                <NavLink to={"/listing/location/kraków"}></NavLink>
              </li>
              <li>
                <NavLink to={"/listing/location/gdańsk"}></NavLink>
              </li>
              <li>
                <NavLink to={"/listing/location/wrocław"}></NavLink>
              </li>
              <li>
                <NavLink to={"/listing/location/poznań"}></NavLink>
              </li>
              <li>
                <NavLink to={"/listing/location/łódź"}></NavLink>
              </li> 
            </ul> 
          </div> 
          <div className={styles.footerColumn}>
            <h3 className={styles.footerTitle}> </h3>
            <p>
              
            </p>
            <p>
              <NavLink to="/about"></NavLink>
            </p>
          </div>
        </div>
      </CenteredContent>
    </footer>
  );
}

export default Footer; 


