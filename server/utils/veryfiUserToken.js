// /utils/veryfiUserToken.js

import jwt from "jsonwebtoken"; // Importowanie biblioteki JSON Web Token do obsługi tokenów JWT

// Przy wykonywaniu fetch na serwer, należy dodać credentials: "include" do opcji fetch
// ponieważ inaczej ciasteczka nie zostaną dołączone do żądania i token z cookie nie będzie dostępny!
export const verifyUserToken = (req, res, next) => {
  // Logowanie ciasteczek przesłanych w żądaniu w formacie JSON
  console.log("Cookies: ", JSON.stringify(req.cookies, null, 2));

  // Pobieranie tokena dostępu z ciasteczka o nazwie 'accesstoken'
  const token = req.cookies.accesstoken;

  // Logowanie wartości tokena do celów debugowania
  console.log("token verifyUserToken:", token);

  // Tymczasowe pominięcie weryfikacji tokena, pozwala na przejście do następnego middleware
  // return next();

  // Jeśli token nie istnieje, zwróć status 401 (nieautoryzowany) z komunikatem błędu
  if (!token) return res.status(401).json({ errors: "Not authenticated!" });

  // Weryfikacja tokena za pomocą sekretu zdefiniowanego w zmiennych środowiskowych
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // Jeśli weryfikacja tokena się nie powiedzie, zwróć status 401
    if (err) return res.status(401).json({ errors: "Not authenticated!" });

    req.user = user; // Przypisanie zweryfikowanego użytkownika do obiektu żądania
    req.userId = user.id; // Przypisanie identyfikatora użytkownika do obiektu żądania
    next(); // Przejście do następnego middleware
  });
};
