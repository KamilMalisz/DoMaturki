import { NavLink } from "react-router-dom";
import { BACK_END_URL } from "../../constants/api";
import styles from "./cityCard.module.css";

const CityCard = ({ cityName }) => {
  const cityNameLower = cityName.toLowerCase();
  const cityImage = `${BACK_END_URL}/img/cities/${cityNameLower}.jpg`;

  return (
    <NavLink
      to={`/listing/location/${encodeURIComponent(cityNameLower)}`}
      className={styles.cityCard}
    >
      <div className={styles.imageContainer}>
        <img src={cityImage} alt={cityName} />
      </div>
      <div className={styles.cityName}>
        <strong>{cityName}</strong>
      </div>
    </NavLink>
  );
};

export default CityCard;
