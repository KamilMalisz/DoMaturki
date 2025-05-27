//  /routes/Register/Register.jsx

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CenteredContent from "../../components/CenteredContent/CenteredContent";
import { register } from "../../auth/auth";
import styles from "../../styles/formStyles.module.css"; // Import stylów modułowych

function Register() {
  const [values, setValues] = useState({
    username: "",
    password: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", // Resetowanie błędu dla konkretnego pola
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setErrors({});
    setSuccess(false);

    try {
      const data = await register(values);
      if (data.errors) {
        setErrors(data.errors);
      } else {
        setSuccess(true);
        setValues({
          username: "",
          password: "",
          email: "",
        });

        navigate("/login");
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas rejestracji:", error);
      setErrors({
        general: "Wystąpił błąd podczas rejestracji. Spróbuj ponownie później.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CenteredContent>
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Rejestracja</h2>
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.formGroup}>
              <label htmlFor="username">Nazwa użytkownika</label>
              <div>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Wprowadź użytkownika"
                  value={values.username}
                  onChange={handleChange}
                  className={errors?.username ? styles.inputError : ""}
                />
                {errors?.username && (
                  <span className={styles.errorMessage}>{errors.username}</span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Adres email</label>
              <div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Wprowadź adres email"
                  value={values.email}
                  onChange={handleChange}
                  className={errors?.email ? styles.inputError : ""}
                />
                {errors?.email && (
                  <span className={styles.errorMessage}>{errors.email}</span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Hasło</label>
              <div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Wprowadź hasło"
                  value={values.password}
                  onChange={handleChange}
                  className={errors?.password ? styles.inputError : ""}
                />
                {errors?.password && (
                  <span className={styles.errorMessage}>{errors.password}</span>
                )}
              </div>
            </div>

            {errors?.general && (
              <span className={`${styles.errorMessage} ${styles.generalError}`}>
                {errors.general}
              </span>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={styles.buttonSubmit}
            >
              {isLoading ? "Rejestrowanie..." : "Zarejestruj"}
            </button>

            <div className={styles.additionalAction}>
              <Link to="/login">Masz już konto? Zaloguj się</Link>
            </div>
          </form>

          {success && (
            <div className={styles.successMessage}>
              Rejestracja zakończona sukcesem! Przekierowanie do logowania...
            </div>
          )}
        </div>
      </div>
    </CenteredContent>
  );
}

export default Register;
