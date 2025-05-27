// /routes/EditUser/EditUser.jsx
import { useState, useContext, useEffect } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import CenteredContent from "../../components/CenteredContent/CenteredContent";
import { updateUserAction } from "../../api/userActions";
import { AuthContext } from "../../context/AuthContext";
import { haveUserAccessToHisAction } from "../../auth/auth";
import formStyles from "../../styles/formStyles.module.css";
import ContentBox from "../../components/ContentBox/ContentBox";

function EditUser() {
  const navigate = useNavigate();
  const user = useLoaderData();
  const { userData } = useContext(AuthContext);

  useEffect(() => {
    if (!haveUserAccessToHisAction(userData, user)) {
      console.log("Nie masz dostępu do edycji tego profilu");
      navigate("/listings");
    }
  }, [userData, user, navigate]);

  const [values, setValues] = useState({
    username: user.username || "",
    email: user.email || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    companyName: user.companyName || "",
    address: user.address || "",
    telephone: user.telephone || "",
    password: "",
    avatar: user.avatar || "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: files && files.length > 0 ? files[0] : value,
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

    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      formData.set(key, values[key]);
    });

    try {
      const data = await updateUserAction(user._id, formData);
      if (data.errors) {
        setErrors(data.errors);
      } else {
        setSuccess(true);
        navigate(`/profile/${user._id}`);
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas aktualizacji profilu:", error);
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
      <ContentBox title="Edycja profilu:">
        <div className={formStyles.formContainer}>
          <form onSubmit={handleSubmit} noValidate>
            <div className={formStyles.formGroup}>
              <label htmlFor="username">Nazwa użytkownika: </label>
              <span>{values.username}</span>
            </div>

            <div className={formStyles.formGroup}>
              <label htmlFor="email">Adres email</label>
              <span>{values.email}</span>
            </div>

            <div className={formStyles.formGroup}>
              <label htmlFor="firstName">Imię</label>
              <div>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="Wprowadź imię"
                  value={values.firstName}
                  onChange={handleChange}
                  className={errors?.firstName ? formStyles.inputError : ""}
                />
                {errors?.firstName && (
                  <span className={formStyles.errorMessage}>
                    {errors.firstName}
                  </span>
                )}
              </div>
            </div>

            <div className={formStyles.formGroup}>
              <label htmlFor="lastName">Nazwisko</label>
              <div>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Wprowadź nazwisko"
                  value={values.lastName}
                  onChange={handleChange}
                  className={errors?.lastName ? formStyles.inputError : ""}
                />
                {errors?.lastName && (
                  <span className={formStyles.errorMessage}>
                    {errors.lastName}
                  </span>
                )}
              </div>
            </div>

            <div className={formStyles.formGroup}>
              <label htmlFor="companyName">Nazwa firmy</label>
              <div>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  placeholder="Wprowadź nazwę firmy"
                  value={values.companyName}
                  onChange={handleChange}
                  className={errors?.companyName ? formStyles.inputError : ""}
                />
                {errors?.companyName && (
                  <span className={formStyles.errorMessage}>
                    {errors.companyName}
                  </span>
                )}
              </div>
            </div>

            <div className={formStyles.formGroup}>
              <label htmlFor="address">Adres</label>
              <div>
                <input
                  type="text"
                  name="address"
                  id="address"
                  placeholder="Wprowadź adres"
                  value={values.address}
                  onChange={handleChange}
                  className={errors?.address ? formStyles.inputError : ""}
                />
                {errors?.address && (
                  <span className={formStyles.errorMessage}>
                    {errors.address}
                  </span>
                )}
              </div>
            </div>

            <div className={formStyles.formGroup}>
              <label htmlFor="telephone">Telefon</label>
              <div>
                <input
                  type="text"
                  name="telephone"
                  id="telephone"
                  placeholder="Wprowadź telefon"
                  value={values.telephone}
                  onChange={handleChange}
                  className={errors?.telephone ? formStyles.inputError : ""}
                />
                {errors?.telephone && (
                  <span className={formStyles.errorMessage}>
                    {errors.telephone}
                  </span>
                )}
              </div>
            </div>

            <div className={formStyles.formGroup}>
              <label htmlFor="password">Nowe hasło (opcjonalnie)</label>
              <div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Wprowadź nowe hasło"
                  value={values.password}
                  onChange={handleChange}
                  className={errors?.password ? formStyles.inputError : ""}
                />
                {errors?.password && (
                  <span className={formStyles.errorMessage}>
                    {errors.password}
                  </span>
                )}
              </div>
            </div>

            <div className={formStyles.formGroup}>
              <label htmlFor="avatar">Avatar URL</label>
              <div>
                <input
                  type="file"
                  name="avatar"
                  id="avatar"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleChange}
                  className={errors?.avatar ? formStyles.inputError : ""}
                />
                {errors?.avatar && (
                  <span className={formStyles.errorMessage}>
                    {errors.avatar}
                  </span>
                )}
              </div>
            </div>

            {errors?.general && (
              <span className={formStyles.generalError}>{errors.general}</span>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={formStyles.buttonSubmit}
            >
              {isLoading ? "Aktualizowanie..." : "Aktualizuj profil"}
            </button>

            {success && (
              <div className={formStyles.successMessage}>
                Profil został zaktualizowany pomyślnie! Przekierowanie...
              </div>
            )}
          </form>
        </div>
      </ContentBox>
    </CenteredContent>
  );
}

export default EditUser;
