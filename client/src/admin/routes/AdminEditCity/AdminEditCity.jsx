// /src/admin/routes/AdminEditCity/AdminEditCity.js

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../../styles/formStyles.module.css"; // Import wspólnych stylów
import CenteredContent from "../../../components/CenteredContent/CenteredContent";
import { updateCityAction, getCity } from "../../api/cityActions";
import MapPicker from "../../../components/MapPicker/MapPicker";
import ContentBox from "../../../components/ContentBox/ContentBox";
import { VOIVODESHIPS } from "../../../constants/api";

function AdminEditCity() {
  const { id } = useParams();

  const [values, setValues] = useState({
    name: "",
    voivodeship: "",
    district: "",
    commune: "",
    type: "miasto",
    description: "",
    latitude: "",
    longitude: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCity = async () => {
      const data = await getCity(id);
      setValues(data);
    };

    fetchCity();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      const data = await updateCityAction(values);
      if (data.errors) {
        setErrors(data.errors);
      } else {
        setSuccess(true);
        navigate(`/admin/cities/${data._id}`);
      }
    } catch (error) {
      setErrors({
        general:
          "Wystąpił błąd podczas aktualizacji. Spróbuj ponownie później.",
      });

      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CenteredContent>
      <ContentBox title="Edytuj miasto">
        <div className={styles.formContainer}>
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nazwa miasta</label>
              <div>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Wprowadź nazwę miasta"
                  value={values.name}
                  onChange={handleChange}
                  className={errors?.name ? styles.inputError : ""}
                />
                {errors?.name && (
                  <span className={styles.errorMessage}>{errors.name}</span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="voivodeship">Województwo</label>
              <div>
                <select
                  name="voivodeship"
                  id="voivodeship"
                  value={values.voivodeship}
                  onChange={handleChange}
                  className={errors?.voivodeship ? styles.inputError : ""}
                >
                  {VOIVODESHIPS.map((voivodeship) => (
                    <option key={voivodeship} value={voivodeship}>
                      {voivodeship}
                    </option>
                  ))}
                </select>
                {errors?.voivodeship && (
                  <span className={styles.errorMessage}>
                    {errors.voivodeship}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="district">Powiat (opcjonalnie)</label>
              <div>
                <input
                  type="text"
                  name="district"
                  id="district"
                  placeholder="Wprowadź powiat"
                  value={values.district}
                  onChange={handleChange}
                  className={errors?.district ? styles.inputError : ""}
                />
                {errors?.district && (
                  <span className={styles.errorMessage}>{errors.district}</span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="commune">Gmina (opcjonalnie)</label>
              <div>
                <input
                  type="text"
                  name="commune"
                  id="commune"
                  placeholder="Wprowadź gminę"
                  value={values.commune}
                  onChange={handleChange}
                  className={errors?.commune ? styles.inputError : ""}
                />
                {errors?.commune && (
                  <span className={styles.errorMessage}>{errors.commune}</span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="type">Typ miejscowości</label>
              <div>
                <select
                  name="type"
                  id="type"
                  value={values.type}
                  onChange={handleChange}
                  className={errors?.type ? styles.inputError : ""}
                >
                  <option value="miasto">Miasto</option>
                  <option value="miasteczko">Miasteczko</option>
                  <option value="wieś">Wieś</option>
                </select>
                {errors?.type && (
                  <span className={styles.errorMessage}>{errors.type}</span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Opis (opcjonalnie)</label>
              <div>
                <textarea
                  name="description"
                  id="description"
                  placeholder="Wprowadź opis"
                  value={values.description}
                  onChange={handleChange}
                  className={errors?.description ? styles.inputError : ""}
                />
                {errors?.description && (
                  <span className={styles.errorMessage}>
                    {errors.description}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="latitude">Szerokość geograficzna</label>
              <div>
                <input
                  type="number"
                  name="latitude"
                  id="latitude"
                  placeholder="Wprowadź szerokość geograficzną"
                  value={values.latitude}
                  onChange={handleChange}
                  className={errors?.latitude ? styles.inputError : ""}
                />
                {errors?.latitude && (
                  <span className={styles.errorMessage}>{errors.latitude}</span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="longitude">Długość geograficzna</label>
              <div>
                <input
                  type="number"
                  name="longitude"
                  id="longitude"
                  placeholder="Wprowadź długość geograficzną"
                  value={values.longitude}
                  onChange={handleChange}
                  className={errors?.longitude ? styles.inputError : ""}
                />
                {errors?.longitude && (
                  <span className={styles.errorMessage}>
                    {errors.longitude}
                  </span>
                )}
              </div>
            </div>

            <div className={styles.mapGroup}>
              <label>Wybierz lokalizację na mapie:</label>
              <MapPicker
                latitude={values.latitude}
                longitude={values.longitude}
                setLatitude={(lat) =>
                  setValues((prevValues) => ({
                    ...prevValues,
                    latitude: lat,
                  }))
                }
                setLongitude={(lng) =>
                  setValues((prevValues) => ({
                    ...prevValues,
                    longitude: lng,
                  }))
                }
              />
            </div>

            {errors?.general && (
              <span className={styles.generalError}>{errors.general}</span>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={styles.buttonSubmit}
            >
              {isLoading ? "Aktualizowanie..." : "Aktualizuj miasto"}
            </button>
          </form>

          {success && (
            <div className={styles.successMessage}>
              Miasto zaktualizowane pomyślnie! Przekierowanie...
            </div>
          )}
        </div>
      </ContentBox>
    </CenteredContent>
  );
}

export default AdminEditCity;
