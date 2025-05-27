//  /routes/Login/Login.jsx

import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { login } from "../../auth/auth";
import { useNavigate, useLocation, Link } from "react-router-dom";
import CenteredContent from "../../components/CenteredContent/CenteredContent";
import styles from "../../styles/formStyles.module.css"; // Import modułów CSS

function Login() {
  const { updateUserData } = useContext(AuthContext);

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

    try {
      const data = await login(values);

      if (data.error) {
        setErrors({ general: data.error });
      } else {
        updateUserData(data); // Zapisanie danych użytkownika i tokena

        // Przekierowanie na stronę, którą użytkownik próbował odwiedzić przed logowaniem
        const redirectPath = location.state?.from || "/";
        navigate(redirectPath);
      }
    } catch (error) {
      console.error("Wystąpił błąd podczas logowania:", error);
      setErrors({
        general: "Wystąpił błąd podczas logowania. Spróbuj ponownie później.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CenteredContent>
      <div className={styles.formWrapper}>
        <div className={styles.formContainer}>
          <h2 className={styles.formTitle}>Logowanie</h2>
          <form onSubmit={handleSubmit} noValidate>
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
              {isLoading ? "Logowanie..." : "Zaloguj"}
            </button>

            <div className={styles.additionalAction}>
              <Link to="/register">Nie masz konta? Zarejestruj się</Link>
            </div>
          </form>
        </div>
      </div>
    </CenteredContent>
  );
}

export default Login;
