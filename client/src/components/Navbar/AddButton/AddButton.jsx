// src/components/Navbar/AddButton/AddButton.js

import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import styles from "./addButton.module.css";

function AddButton() {
  const { userData } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAddClick = () => {
    if (!userData) {
      navigate("/login", { state: { from: "/listing/add" } });
    } else {
      navigate("/listing/add");
    }
  };

  return (
    <div className={styles.addButtonWrapper}>
      <button className={styles.addListing} onClick={handleAddClick}>
        Dodaj ogłoszenie
      </button>
    </div>
  );
}

export default AddButton;
