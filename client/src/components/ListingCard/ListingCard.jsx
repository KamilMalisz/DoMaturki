import { NavLink } from "react-router-dom";
import styles from "./listingCard.module.css";
import { BACK_END_URL } from "../../constants/api";
import { formatPricePLN } from "../../utils/formatPrice";

const ListingCard = ({ listing }) => {
  return (
    <NavLink to={`/listing/${listing._id}`} className={styles.listingCard}>
      <div className={styles.imageContainer}>
        <img
          src={`${BACK_END_URL}${listing.imageUrls[0]}`}
          alt={listing.title}
        />
      </div>
      <div className={styles.listingDetails}>
        <h3 className={styles.listingTitle}>{listing.title}</h3>
        <div className={styles.listingInfo}>
          <div className={styles.leftColumn}>
            <p className={styles.city}>
              <strong>{listing.locality}</strong>
            </p>
            {/*  <p>
              {listing.size} m<sup>2</sup>
            </p> */}
            {/*
            <p>
              {listing.rooms} {listing.rooms === 1 ? "pokój" : "pokoje"}
            </p>
            */}
          </div>
          <div className={styles.rightColumn}>
            <p className={styles.price}>
              <strong>{formatPricePLN(listing.price)}</strong>
            </p>
            {/*
            <p>
              {formatPricePLN(listing.price / listing.size)} / m<sup>2</sup>
            </p>
            */}
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default ListingCard;
