import { NavLink } from "react-router-dom";
import styles from "./userInfo.module.css";
import { BACK_END_URL } from "../../constants/api";
import DataTable from "../DataTable/DataTable";
import ContentBox from "../ContentBox/ContentBox";

// user - oglądany user
// userData - zalogowany użytkownik
const UserInfo = ({ user, userData, showUserEdit = false }) => {
  const userDetails = [
    {
      label: "Nazwa użytkownika",
      value: <NavLink to={`/profile/${user._id}`}>{user.username}</NavLink>,
    },
    { label: "Email", value: user.email },
  ];

  user.firstName && userDetails.push({ label: "Imię:", value: user.firstName });
  user.lastName &&
    userDetails.push({ label: "Nazwisko:", value: user.lastName });
  user.companyName &&
    userDetails.push({ label: "Nazwa firmy:", value: user.companyName });
  user.address && userDetails.push({ label: "Adres:", value: user.address });
  user.telephone &&
    userDetails.push({ label: "Telefon:", value: user.telephone });

  return (
    <>
      <div className={styles.userInfo}>
        <p>
          <img
            src={`${BACK_END_URL}${user.avatar}`}
            alt="Avatar"
            className={styles.userImg}
          />
        </p>

        <DataTable data={userDetails} labelValueMode={true} />
      </div>
      <ContentBox title="Akcje użytkownika">
        <ul>
          {showUserEdit && userData && userData._id === user._id && (
            <li>
              <NavLink to={`/profile/edit/${userData._id}`}>
                Edytuj profil
              </NavLink>
            </li>
          )}
          {userData && (
            <li>
              <NavLink to={`/logout`}>Wylogowanie</NavLink>
            </li>
          )}
        </ul>
      </ContentBox>
    </>
  );
};

export default UserInfo;
