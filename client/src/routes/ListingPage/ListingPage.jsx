import { NavLink, useLoaderData } from "react-router-dom";
import styles from "./listingPage.module.css";
import CenteredContent from "../../components/CenteredContent/CenteredContent";
import ContentBox from "../../components/ContentBox/ContentBox";
import PhotosViewer from "../../components/PhotosViewer/PhotosViewer";
import { formatPricePLN } from "../../utils/formatPrice";
import { formatDate } from "../../utils/formatDate";
import DataTable from "../../components/DataTable/DataTable";
import MapPicker from "../../components/MapPicker/MapPicker";
import UserInfo from "../../components/UserInfo/UserInfo";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import FinishListingButton from "../../components/FinishListingButton/FinishListingButton";

function ListingPage() {
  const { userData } = useContext(AuthContext);
  const listing = useLoaderData();

  const detailsData = [
    { label: "Forma korepetycji:", value: listing.type },
    { label: "Lokalizacja:", value: listing.locality },
    { label: "Przedmiot:", value: listing.propertyType },
    { label: "Cena za godzinę:", value: formatPricePLN(listing.price) },
  /* { label: "Pokoje:", value: listing.rooms },   */
  /* { label: "Łazienki:", value: listing.bathrooms }, */
  /*  { label: "Piętro:", value: listing.floor },     */
  /* { label: "Wielkość:", value: `${listing.size} m2` },  */
  /* { label: "Szerokość geograficzna:", value: listing.latitude },*/
  /*  { label: "Długość geograficzna:", value: listing.longitude }, */
    { label: "Województwo:", value: listing.voivodeship },
    { label: "Zakończona oferta:", value: listing.finished ? "Tak" : "Nie" }, 
    { label: "Utworzono:", value: formatDate(listing.createdAt) },
    { label: "Aktualizacja:", value: formatDate(listing.updatedAt) },
  ];

  return (
    <>
      <CenteredContent>
        <div className={styles.singlePage}>
          {userData &&
            userData._id === listing.userRef._id &&
            !listing.finished && (
              <ContentBox>
                <NavLink to={`/listing/edit/${listing._id}`}>
                  Edytuj listing
                </NavLink>
                <div>
                  <FinishListingButton listingId={listing._id} />
                </div>
              </ContentBox>
            )}
          {listing.finished && <ContentBox>Listing zakończony</ContentBox>}

          <ContentBox title={listing.title}>
            <PhotosViewer images={listing.imageUrls} />
          </ContentBox>

          <ContentBox title="Opis:">
            <div dangerouslySetInnerHTML={{ __html: listing.description }} />
          </ContentBox>

          <ContentBox title="Szczegóły ogłoszenia:">
            <DataTable data={detailsData} labelValueMode={true} />
          </ContentBox>

          <ContentBox title="Mapa:">
            <MapPicker
              latitude={listing.latitude}
              longitude={listing.longitude}
            />
          </ContentBox>

          <ContentBox title="O autorze:">
            <UserInfo user={listing.userRef} />
          </ContentBox>
        </div>
      </CenteredContent>
    </>
  );
}

export default ListingPage;
