import CityCard from "../CityCard/CityCard";
import styles from "./popularCities.module.css";

const PopularCities = () => {
  const cities = ["Warszawa", "Kraków", "Gdańsk", "Wrocław"];

  return (
    <div className={styles.popularCities}>
      {cities.map((city) => (
        <CityCard key={city} cityName={city} />
      ))}
    </div>
  );
};

export default PopularCities;
