import { useLoaderData } from "react-router-dom";
import styles from "./user.module.css";
import CenteredContent from "../../components/CenteredContent/CenteredContent";
import ContentBox from "../../components/ContentBox/ContentBox";
import UserInfo from "../../components/UserInfo/UserInfo";
import ListingItem from "../../components/ListingItem/ListingItem";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function User() {
  const { userData } = useContext(AuthContext);
  const user = useLoaderData();

  return (
    <>
      <CenteredContent>
        <ContentBox title="">
          <UserInfo user={user} userData={userData} showUserEdit={true} />
        </ContentBox>

        <div className={styles.userListings}>
          <h3>Oferty użytkownika:</h3>
          {user.listings && user.listings.length > 0 ? (
            user.listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} user={user} />
            ))
          ) : (
            <p>Brak ogłoszeń do wyświetlenia</p>
          )}
        </div>
      </CenteredContent>
    </>
  );
}

export default User;
