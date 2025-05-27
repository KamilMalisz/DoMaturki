// /controllers/auth.controller.js

import User from "../models/user.model.js"; // Importowanie modelu User do interakcji z bazą danych
import bcryptjs from "bcryptjs"; // Importowanie bcryptjs do haszowania haseł
import jwt from "jsonwebtoken"; // Importowanie jsonwebtoken do generowania i weryfikacji tokenów JWT

// Funkcja rejestracji nowego użytkownika
const register = async (req, res) => {
  try {
    const { username, password, email } = req.body; // Destrukturyzacja danych z ciała żądania

    // Tworzenie nowego użytkownika z podanymi danymi
    const newUser = new User({
      username,
      password,
      email,
      role: "user", // Ustawienie domyślnej roli jako 'user'
    });

    const errors = {}; // Inicjalizacja obiektu do zbierania błędów

    // Sprawdzenie, czy użytkownik z podanym emailem już istnieje
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      errors.email = "Email jest już zarejestrowany"; // Dodanie błędu, jeśli email jest zajęty
    }

    // Sprawdzenie, czy użytkownik z podaną nazwą użytkownika już istnieje
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      errors.username = "Nazwa użytkownika jest już zajęta";
    }

    // Ręczne uruchomienie walidacji schematu użytkownika
    const validationError = newUser.validateSync();
    if (validationError) {
      // Iteracja przez wszystkie błędy walidacji
      Object.keys(validationError.errors).forEach((key) => {
        errors[key] = validationError.errors[key].message; // Dodanie każdego błędu do obiektu errors
      });
    }

    // Jeśli występują jakiekolwiek błędy (unikalność lub walidacja), zwróć je wszystkie
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ errors });
    }

    // Hashowanie hasła użytkownika przed zapisaniem do bazy danych
    const hashedPassword = bcryptjs.hashSync(password, 10); // Haszowanie hasła z solą o długości 10
    newUser.password = hashedPassword; // Przypisanie zahaszowanego hasła do użytkownika

    // Zapisanie użytkownika i przechowanie wynikowego obiektu
    const savedUser = await newUser.save();

    // Destrukturyzacja obiektu użytkownika, aby wykluczyć hasło
    const { password: pass, ...userWithoutPassword } = savedUser._doc;

    res.status(201).json(userWithoutPassword); // Zwrócenie statusu 201 z danymi użytkownika bez hasła
  } catch (error) {
    console.log("błąd: ", error.message);

    res.status(500).json({ message: "Wystąpił błąd serwera" });
  }
};

// Funkcja logowania użytkownika
const login = async (req, res, next) => {
  const { email, password } = req.body; // Destrukturyzacja danych z ciała żądania
  try {
    const userInDb = await User.findOne({ email }); // Wyszukiwanie użytkownika po emailu
    if (!userInDb) return res.status(404).json({ error: "User not found!" });

    // Porównanie podanego hasła z zahaszowanym hasłem w bazie danych
    const passCompareResult = bcryptjs.compareSync(password, userInDb.password);

    if (!passCompareResult)
      return res.status(401).json({ error: "Błędne dane logowania!" });

    // Generowanie tokena JWT z identyfikatorem użytkownika
    const token = jwt.sign({ _id: userInDb._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // Token wygaśnie po 7 dniach
    });

    // Wykluczenie hasła z danych użytkownika przed wysłaniem odpowiedzi
    const { password: pass, ...userData } = userInDb._doc;

    userData.token = token; // Dodanie tokena do danych użytkownika

    console.log("token: ", token);

    // Ustawienie dodatkowych ciasteczek dla celów testowych
    res.setHeader("Set-Cookie", "test=myValue");

    // Ustawienie ciasteczka 'accesstoken' z tokenem JWT
    res
      .cookie("accesstoken", token, {
        // httpOnly: true, // JavaScript nie będzie mogło go odczytać ani modyfikować (zakomentowane)
        // secure: process.env.NODE_ENV === "production", // Ustawienie secure dla produkcji (HTTPS) (zakomentowane)
        // sameSite: "strict", // Ochrona przed atakami CSRF (zakomentowane)
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dni w milisekundach
      })
      .status(200)
      .json(userData);
  } catch (error) {
    next(error);
  }
};

// Funkcja wylogowania użytkownika
const logout = async (req, res, next) => {
  try {
    res.clearCookie("accesstoken"); // Usunięcie ciasteczka 'accesstoken' z przeglądarki
    // Zwrócenie statusu 200 z komunikatem potwierdzającym wylogowanie
    res.status(200).json({ message: "Użytkownik wylogowany!" });
  } catch (error) {
    next(error);
  }
};

export { register, login, logout };
