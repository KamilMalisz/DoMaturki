// /routes/EditListing/EditListing.jsx
import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "../../styles/formStyles.module.css"; // Importuj moduły CSS
import CenteredContent from "../../components/CenteredContent/CenteredContent";
import { updateListingAction, getListing } from "../../api/listingActions";
import { AuthContext } from "../../context/AuthContext";

import MapPicker from "../../components/MapPicker/MapPicker"; // Import MapPicker
import { haveUserAccessToHisAction } from "../../auth/auth";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { VOIVODESHIPS } from "../../constants/api";

function EditListing() {
  const { userData } = useContext(AuthContext);
  const { id } = useParams();

  const [values, setValues] = useState({
    title: "",
    description: "",
    price: "",
    rooms: "",
    bathrooms: "",
    floor: "",
    size: "",
    locality: "",
    address: "",
    voivodeship: "",
    latitude: "",
    longitude: "",
    type: "sprzedaż",
    propertyType: "mieszkanie",
    imageUrls: [],
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      const data = await getListing(id);

      setValues({
        ...data,
        imageUrls: [],
      });

      if (!haveUserAccessToHisAction(userData, data.userRef)) {
        console.log("Nie masz dostępu do edycji tego profilu");
        navigate("/listings");
      }
    };

    fetchListing();
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

  // Funkcja obsługująca zmianę dla edytora React Quill
  const handleDescriptionChange = (value) => {
    setValues((prevValues) => ({
      ...prevValues,
      description: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      description: "",
    }));
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setErrors({});
    setSuccess(false);

    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.set(key, values[key]);
    });
    formData.set("userRef", userData._id);

    Array.from(images).forEach((image) => {
      formData.append("images", image);
    });

    try {
      const data = await updateListingAction(formData);
      if (data.errors) {
        setErrors(data.errors);
      } else {
        setSuccess(true);
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      console.error("Error updating listing:", error);
      setErrors({
        general:
          "Wystąpił błąd podczas aktualizacji. Spróbuj ponownie później.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CenteredContent>
      <div className={styles.formContainer}>
        <h3>Edycja listingu nieruchomości</h3>
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="title">Tytuł</label>
            <div>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Wprowadź tytuł"
                value={values.title}
                onChange={handleChange}
                className={errors?.title ? styles.inputError : ""}
              />
              {errors?.title && (
                <span className={styles.errorMessage}>{errors.title}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Opis</label>
            <div>
              <ReactQuill
                value={values.description}
                onChange={handleDescriptionChange}
              />
              {/*<textarea
                name="description"
                id="description"
                placeholder="Wprowadź opis"
                value={values.description}
                onChange={handleChange}
                className={errors?.description ? styles.inputError : ""}
              />*/}
              {errors?.description && (
                <span className={styles.errorMessage}>
                  {errors.description}
                </span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price">Cena</label>
            <div>
              <input
                type="number"
                name="price"
                id="price"
                placeholder="Wprowadź cenę"
                value={values.price}
                onChange={handleChange}
                className={errors?.price ? styles.inputError : ""}
              />
              {errors?.price && (
                <span className={styles.errorMessage}>{errors.price}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="rooms">Liczba pokoi</label>
            <div>
              <input
                type="number"
                name="rooms"
                id="rooms"
                placeholder="Wprowadź liczbę pokoi"
                value={values.rooms}
                onChange={handleChange}
                className={errors?.rooms ? styles.inputError : ""}
              />
              {errors?.rooms && (
                <span className={styles.errorMessage}>{errors.rooms}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bathrooms">Liczba łazienek</label>
            <div>
              <input
                type="number"
                name="bathrooms"
                id="bathrooms"
                placeholder="Wprowadź liczbę łazienek"
                value={values.bathrooms}
                onChange={handleChange}
                className={errors?.bathrooms ? styles.inputError : ""}
              />
              {errors?.bathrooms && (
                <span className={styles.errorMessage}>{errors.bathrooms}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="floor">Piętro</label>
            <div>
              <input
                type="number"
                name="floor"
                id="floor"
                placeholder="Wprowadź piętro"
                value={values.floor}
                onChange={handleChange}
                className={errors?.floor ? styles.inputError : ""}
              />
              {errors?.floor && (
                <span className={styles.errorMessage}>{errors.floor}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="size">Rozmiar (m²)</label>
            <div>
              <input
                type="number"
                name="size"
                id="size"
                placeholder="Wprowadź rozmiar"
                value={values.size}
                onChange={handleChange}
                className={errors?.size ? styles.inputError : ""}
              />
              {errors?.size && (
                <span className={styles.errorMessage}>{errors.size}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="locality">Miejscowość</label>
            <div>
              <input
                type="text"
                name="locality"
                id="locality"
                placeholder="Wprowadź miejscowość"
                value={values.locality}
                onChange={handleChange}
                className={errors?.locality ? styles.inputError : ""}
              />
              {errors?.locality && (
                <span className={styles.errorMessage}>{errors.locality}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Adres</label>
            <div>
              <input
                type="text"
                name="address"
                id="address"
                placeholder="Wprowadź adres"
                value={values.address}
                onChange={handleChange}
                className={errors?.address ? styles.inputError : ""}
              />
              {errors?.address && (
                <span className={styles.errorMessage}>{errors.address}</span>
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
            <label htmlFor="latitude">Szerokość geograficzna</label>
            <div>
              <input
                type="text"
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
                type="text"
                name="longitude"
                id="longitude"
                placeholder="Wprowadź długość geograficzną"
                value={values.longitude}
                onChange={handleChange}
                className={errors?.longitude ? styles.inputError : ""}
              />
              {errors?.longitude && (
                <span className={styles.errorMessage}>{errors.longitude}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="mapPicker">Wybierz lokalizację na mapie</label>
            <div>
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
              {errors?.location && (
                <span className={styles.errorMessage}>{errors.location}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="type">Typ transakcji</label>
            <div>
              <select
                name="type"
                id="type"
                value={values.type}
                onChange={handleChange}
                className={errors?.type ? styles.inputError : ""}
              >
                <option value="sprzedaż">Sprzedaż</option>
                <option value="wynajem">Wynajem</option>
              </select>
              {errors?.type && (
                <span className={styles.errorMessage}>{errors.type}</span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="propertyType">Typ nieruchomości</label>
            <div>
              <select
                name="propertyType"
                id="propertyType"
                value={values.propertyType}
                onChange={handleChange}
                className={errors?.propertyType ? styles.inputError : ""}
              >
                <option value="mieszkanie">Mieszkanie</option>
                <option value="dom">Dom</option>
                <option value="działka">Działka</option>
                <option value="lokal użytkowy">Lokal użytkowy</option>
                <option value="garaż">Garaż</option>
                <option value="hale i magazyny">Hale i magazyny</option>
              </select>
              {errors?.propertyType && (
                <span className={styles.errorMessage}>
                  {errors.propertyType}
                </span>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="images">Zaktualizuj zdjęcia (max 10)</label>
            <div>
              <input
                type="file"
                name="images"
                id="images"
                accept=".jpg,.jpeg,.png"
                multiple
                onChange={handleImageChange}
                className={errors?.images ? styles.inputError : ""}
              />
              {errors?.images && (
                <span className={styles.errorMessage}>{errors.images}</span>
              )}
            </div>
          </div>

          {errors?.general && (
            <div className={styles.formGroup}>
              <span className={styles.generalError}>{errors.general}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={styles.buttonSubmit}
          >
            {isLoading ? "Aktualizowanie..." : "Aktualizuj nieruchomość"}
          </button>
        </form>

        {success && (
          <div className={styles.successMessage}>
            Nieruchomość zaktualizowana pomyślnie! Przekierowanie...
          </div>
        )}
      </div>
    </CenteredContent>
  );
}

export default EditListing;
