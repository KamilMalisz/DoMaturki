import { NavLink } from "react-router-dom";
import styles from "./listingItem.module.css";
import { BACK_END_URL } from "../../constants/api";
import { formatPricePLN } from "../../utils/formatPrice";

const ListingItem = ({ listing, user }) => {
  if (user && typeof listing.userRef !== "object") listing.userRef = user;

  return (
    <NavLink to={`/listing/${listing._id}`} className={styles.listingRow}>
      <div className={styles.imgData}>
        <img
          src={`${BACK_END_URL}${listing.imageUrls[0]}`}
          alt="Przedmiot"
        />
      </div>
      <div className={styles.listingInformation}>
        <p className={styles.listingPrice}>{formatPricePLN(listing.price)}</p>
        <p className={styles.listingTitle}>{listing.title}</p>
        <p className={styles.listingLocaliity}>
          {listing.locality}
          {listing.voivodeship && ", " + listing.voivodeship}
        </p> {/*
        <p className={styles.listingProperties}>
          <ul className={styles.propertiesList}>
           / <li>
              {listing.size} m<sup>2</sup>
            </li>
            <li>
              {formatPricePLN(listing.price / listing.size)} m<sup>2</sup>
            </li>
            <li>
              {listing.floor === 0 ? "parter" : `${listing.floor} piętro`}
            </li>
            <li>
              {listing.rooms} {listing.rooms === 1 ? "pokój" : "pokoje"}
            </li>
          </ul>
        </p> */}
        <div className={styles.userInformation}>
          <img src={`${BACK_END_URL}${listing.userRef.avatar}`} alt="avatar" />
          <div>
            {listing.privateOffer
              ? "Oferta prywatna"
              : listing.userRef.username}
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default ListingItem;
