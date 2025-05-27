// /src/admin/routes/AdminCityList/AdminCityList.js

import { useSearchParams, useNavigate, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import styles from "../../../styles/formStyles.module.css"; // Import wspólnych stylów
import CenteredContent from "../../../components/CenteredContent/CenteredContent";
import { BACK_END_URL, VOIVODESHIPS } from "../../../constants/api";
import Pagination from "../../../components/Pagination/Pagination"; // Importuj komponent paginacji
import DataTable from "../../../components/DataTable/DataTable"; // Importuj DataTable
import ContentBox from "../../../components/ContentBox/ContentBox";

function AdminCityList() {
  const [cities, setCities] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    name: searchParams.get("name") || "",
    voivodeship: searchParams.get("voivodeship") || "",
    page: parseInt(searchParams.get("page")) || 1,
  });

  const fetchCities = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const response = await fetch(
        `${BACK_END_URL}/api/v1/cities/all?${query}`,
        {
          method: "GET",
          credentials: "include", // Uwzględnienie ciasteczek w żądaniu
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }
      const data = await response.json();

      setCities(data.cities); // Ustawienie miast
      setPagination({
        currentPage: data.currentPage,
        totalPages: data.totalPages,
      });
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  useEffect(() => {
    fetchCities(); // Pobranie danych przy pierwszym renderze lub zmianie filtrów
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({
      ...prev,
      page: newPage,
    }));
    setSearchParams({ ...filters, page: newPage });
    navigate(
      `/admin/cities?${new URLSearchParams({
        ...filters,
        page: newPage,
      }).toString()}`
    );
  };

  // Definicja kolumn dla DataTable
  const columns = [
    { header: "Nazwa miasta", field: "name", isLink: true },
    { header: "Województwo", field: "voivodeship" },
    { header: "Typ", field: "type" },
    { header: "Powiat", field: "district" },
    { header: "Gmina", field: "commune" },
  ];

  // Dane do DataTable
  const data = cities.map((city) => ({
    name: { text: city.name, link: `/admin/cities/${city._id}` },
    voivodeship: city.voivodeship,
    type: city.type,
    district: city.district || "N/A",
    commune: city.commune || "N/A",
  }));

  return (
    <CenteredContent>
      <ContentBox title="Lista Miast">
        <div className={styles.formContainer}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nazwa miasta:</label>
            <div>
              <input
                type="text"
                name="name"
                id="name"
                value={filters.name}
                onChange={handleFilterChange}
                className={styles.inputField}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="voivodeship">Województwo:</label>
            <div>
              <select
                name="voivodeship"
                id="voivodeship"
                value={filters.voivodeship}
                onChange={handleFilterChange}
                className={styles.inputField}
              >
                <option value="">Wszystkie</option>
                {VOIVODESHIPS.map((voivodeship) => (
                  <option key={voivodeship} value={voivodeship}>
                    {voivodeship}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/*
          <button onClick={handleSearch} className={styles.buttonSubmit}>
          Szukaj
          </button>
          */}
        </div>

        <DataTable columns={columns} data={data} />

        <Pagination
          page={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      </ContentBox>
      <div>
        <NavLink to={`/admin/cities/add`}>Dodaj miasto</NavLink>
      </div>
    </CenteredContent>
  );
}

export default AdminCityList;
