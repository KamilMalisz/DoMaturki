import { useLoaderData, useParams } from "react-router-dom";
//import styles from "./listingMapForLocation.module.css";
import CenteredContent from "../../components/CenteredContent/CenteredContent";
import ContentBox from "../../components/ContentBox/ContentBox";
import FilteredMapWithListings from "../../components/FilteredMapWithListings/FilteredMapWithListings";

function ListingMapForLocation() {
  const { name } = useParams();
  const cityData = useLoaderData();

  if (!cityData) {
    return <p>Ładowanie danych</p>;
  }

  const initialLat = parseFloat(cityData.latitude);
  const initialLng = parseFloat(cityData.longitude);

  return (
    <CenteredContent>
      <ContentBox
        title={`Lista nieruchomości dla lokalizacji: ${
          name.charAt(0).toUpperCase() + name.slice(1)
        }`}
      >
        <FilteredMapWithListings
          cityData={cityData}
          initialLat={initialLat}
          initialLng={initialLng}
        />
      </ContentBox>
    </CenteredContent>
  );
}

export default ListingMapForLocation;
