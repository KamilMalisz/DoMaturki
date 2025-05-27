// /routes/AddListing/AddListing.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/formStyles.module.css";
import CenteredContent from "../../components/CenteredContent/CenteredContent";
import { addListingAction } from "../../api/listingActions";
import { AuthContext } from "../../context/AuthContext";
import { VOIVODESHIPS } from "../../constants/api.js";
import MapPicker from "../../components/MapPicker/MapPicker";
import CityInputAutocomplete from "../../components/CityInputAutocomplete/CityInputAutocomplete";
import ContentBox from "../../components/ContentBox/ContentBox";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function AddListing() {
  const { userData } = useContext(AuthContext); // Pobranie danych zalogowanego użytkownika
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
    type: "stacjonarnie",
    propertyType: "matematyka",
    imageUrls: [],
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  // Funkcja obsługująca zmianę dla standardowych pól formularza
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("name, value", name, value);

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Resetowanie błędu dla konkretnego pola
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

  const handleSelectCity = (city) => {
    setValues((prevValues) => ({
      ...prevValues,
      locality: city,
    }));
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
      const data = await addListingAction(formData);
      if (data.errors) {
        setErrors(data.errors);
      } else {
        setSuccess(true);
        navigate(`/listing/${data._id}`);
      }
    } catch (error) {
      setErrors({
        general:
          "Wystąpił błąd podczas dodania listingu. Spróbuj ponownie później.",
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CenteredContent>
      <ContentBox title="Dodaj ogłoszenie:">
        <div className={styles.formContainer}>
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
            {/*
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
             */}
             {/*
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
                  <span className={styles.errorMessage}>
                    {errors.bathrooms}
                  </span>
                )}
              </div>
            </div> 

            */}
            {/*
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
            */}
            {/*
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
            */}

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
                  <option value="">Wybierz województwo</option>
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
              <label htmlFor="locality">Miejscowość</label>
              <div>
                <CityInputAutocomplete
                  voivodeship={values.voivodeship}
                  value={values.locality}
                  onChange={(val) =>
                    setValues((prevValues) => ({
                      ...prevValues,
                      locality: val,
                    }))
                  }
                  onSelect={handleSelectCity}
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
            {/*
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
            */}
            
              <div className={styles.formGroup}>
              <label htmlFor="propertyType">Przedmiot</label>
              <div>
                <select
                  name="propertyType"
                  id="propertyType"
                  value={values.propertyType}
                  onChange={handleChange}
                  className={errors?.propertyType ? styles.inputError : ""}
                >
                  <option value="mieszkanie">Matematyka</option>
                  <option value="dom">Język polski</option>
                  <option value="lokal użytkowy">Język angielski</option>
                </select>
                {errors?.propertyType && (
                  <span className={styles.errorMessage}>
                    {errors.propertyType}
                  </span>
                )}
              </div>
            </div>
            

            <div className={styles.formGroup}>
              <label htmlFor="mapPicker">Lokalizacja</label>
              <div>
                <MapPicker
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
              <label htmlFor="images">Zdjęcia (max 10)</label>
              <div>
                <input
                  type="file"
                  name="images"
                  id="images"
                  accept=".jpg,.jpeg,.png"
                  multiple
                  onChange={(e) => setImages(e.target.files)}
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
              {isLoading ? "Dodawanie..." : "Dodaj ogłoszenie"}
            </button>
          </form>

          {success && (
            <div className={styles.successMessage}>
              Ogłoszenie dodane pomyślnie! Przekierowanie...
            </div>
          )}
        </div>
      </ContentBox>
    </CenteredContent>
  );
}

export default AddListing;
