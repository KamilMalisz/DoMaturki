// /src/admin/routes/AdminCityPage/AdminCityPage.js

import { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import CenteredContent from "../../../components/CenteredContent/CenteredContent";
import MapPicker from "../../../components/MapPicker/MapPicker";
import { getCity } from "../../api/cityActions";
import DataTable from "../../../components/DataTable/DataTable";
import ContentBox from "../../../components/ContentBox/ContentBox";

function AdminCityPage() {
  const { id } = useParams();
  const [city, setCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const cityData = await getCity(id);
        if (cityData) {
          setCity(cityData);
        } else {
          setError("Nie znaleziono miasta");
        }
      } catch (err) {
        console.log(err);
        setError("Wystąpił błąd podczas ładowania danych miasta");
      } finally {
        setLoading(false);
      }
    };

    fetchCityData();
  }, [id]);

  if (loading) {
    return (
      <CenteredContent>
        <div>Ładowanie danych miasta...</div>
      </CenteredContent>
    );
  }

  if (error) {
    return (
      <CenteredContent>
        <div>{error}</div>
        <NavLink to="/admin/cities">Powrót do listy miast</NavLink>
      </CenteredContent>
    );
  }

  // Dane do DataTable w trybie label-value
  const cityData = [
    { label: "ID", value: city._id },
    { label: "Nazwa", value: city.name },
    { label: "Województwo", value: city.voivodeship },
    { label: "Powiat", value: city.district || "N/A" },
    { label: "Gmina", value: city.commune || "N/A" },
    { label: "Typ", value: city.type },
    { label: "Opis", value: city.description || "Brak opisu" },
    { label: "Szerokość geograficzna", value: city.latitude },
    { label: "Długość geograficzna", value: city.longitude },
    { label: "Utworzono", value: new Date(city.createdAt).toLocaleString() },
    {
      label: "Ostatnia aktualizacja",
      value: new Date(city.updatedAt).toLocaleString(),
    },
  ];

  return (
    <CenteredContent>
      <ContentBox title="Szczegóły Miasta">
        <div className="singlePage">
          <DataTable data={cityData} labelValueMode={true} />

          <div className="cityMap">
            <h4>Mapa lokalizacji:</h4>
            <MapPicker
              latitude={city.latitude}
              longitude={city.longitude}
              readonly
            />
          </div>

          <div className="cityActions">
            <p>
              <NavLink to={`/admin/cities/edit/${city._id}`}>
                Edytuj miasto
              </NavLink>
            </p>
            <p>
              <NavLink to="/admin/cities">Powrót do listy miast</NavLink>
            </p>
          </div>
        </div>
      </ContentBox>
    </CenteredContent>
  );
}

export default AdminCityPage;
