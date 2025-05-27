
import { useEffect, useState } from "react";
import { getLatestListings } from "../../api/listingActions";
import styles from "./latestListings.module.css";
import ListingCard from "../ListingCard/ListingCard";

const LatestListings = ({ type = "sprzedaż" }) => {
  const [listings, setListings] = useState([]);

  useEffect(() => {
    getLatestListings(3, type)
      .then((data) => {
        setListings(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [type]);

  return (
    
    <div className={styles.latestListings}>
      {listings.map((listing) => (
        <ListingCard key={listing._id} listing={listing} />
      ))}
    </div> 
  );
};

export default LatestListings;
