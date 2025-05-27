import { BACK_END_URL } from "../../constants/api";
import SearchBar from "../SearchBar/SearchBar";
import styles from "./hero.module.css";

export function Hero() {
  const heroImgUrl = `${BACK_END_URL}/`;

  return (
    <div
      className={styles.hero}
      style={{ backgroundImage: `url(${heroImgUrl})` }}
    >
      <SearchBar />
    </div>
  );
}
