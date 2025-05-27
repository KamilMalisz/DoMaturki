import { Link, useSearchParams } from "react-router-dom";
import styles from "./searchBar.module.css";
import { useState } from "react";
import CenteredContent from "../CenteredContent/CenteredContent";
import {
  PROPERTY_TYPES,
  ROOMS_OPTIONS,
  TYPE_OPTIONS,
} from "../../constants/api";
import CityInputAutocomplete from "../CityInputAutocomplete/CityInputAutocomplete";

function SearchBar({ setPage }) {
  const [searchParams] = useSearchParams();

  const [query, setQuery] = useState({
    propertyType: searchParams.get("propertyType") || "mieszkanie",
    type: searchParams.get("type") || "sprzedaż",
    locality: searchParams.get("locality") || "",
    minSize: searchParams.get("minSize") || "",
    maxSize: searchParams.get("maxSize") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    rooms: searchParams.get("rooms") || "",
  });

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  const handleSearch = () => {
    setPage(1);
  };

  return (
    <CenteredContent>
      <div className={styles.searchBar}>
        <div className={styles.searchBarField}>
          <label htmlFor="propertyTypeSelect">Przedmiot:</label>
          <select
            name="propertyType"
            id="propertyTypeSelect"
            onChange={handleChange}
            value={query.propertyType}
          >
            {PROPERTY_TYPES.map((pt) => (
              <option key={pt} value={pt}>
                {pt}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.searchBarField}>
          <label htmlFor="typeSelect">Forma:</label>
          <select
            name="type"
            id="typeSelect"
            onChange={handleChange}
            value={query.type}
          >
            {TYPE_OPTIONS.map((tp) => (
              <option key={tp} value={tp}>
                {tp}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.searchBarField}>
          <label htmlFor="locality">Miasto:</label>
          <CityInputAutocomplete
            voivodeship=""
            value={query.locality}
            onChange={(val) =>
              setQuery((prev) => ({
                ...prev,
                locality: val,
              }))
            }
            onSelect={(val) =>
              setQuery((prev) => ({
                ...prev,
                locality: val,
              }))
            }
          />
        </div>
        <div className={styles.searchBarField}>
          <label>Cena w zł:</label>
          <div className={styles.searchBarRow}>
            <input
              type="text"
              name="minPrice"
              placeholder="Od"
              onChange={handleChange}
              value={query.minPrice}
            />
            <input
              type="text"
              name="maxPrice"
              placeholder="Do"
              onChange={handleChange}
              value={query.maxPrice}
            />
          </div>
        </div>
        {/*
        <div className={styles.searchBarField}>
          <label>
            Powieszchnia w m<sup>2</sup>:
          </label>
          <div className={styles.searchBarRow}>
            <input
              type="text"
              name="minSize"
              placeholder="Od"
              onChange={handleChange}
              value={query.minSize}
            />
            <input
              type="text"
              name="maxSize"
              placeholder="Do"
              onChange={handleChange}
              value={query.maxSize}
            />
          </div>
        </div>
        */}
        {/*
        <div
          className={`${styles.searchBarField} ${styles.searchBarFieldSmall}`}
        >
        
          <label>Ilość pokoi:</label>
          <select name="rooms" onChange={handleChange} value={query.rooms}>
            <option key="none" value="">
              {" "}
            </option>
            {ROOMS_OPTIONS.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        */}
        <div
          className={`${styles.searchBarField} ${styles.searchBarFieldButton}`}
        >
          <Link
            onClick={handleSearch}
            to={`/listings?propertyType=${query.propertyType}&type=${query.type}&locality=${query.locality}&minSize=${query.minSize}&maxSize=${query.maxSize}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}&rooms=${query.rooms}&page=1`}
          >
            <button className={styles.searchBarButton}>Szukaj</button>
          </Link>
        </div>
      </div>
    </CenteredContent>
  );
}

export default SearchBar;
