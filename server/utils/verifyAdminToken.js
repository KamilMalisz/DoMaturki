// /utils/verifyAdminToken.js

import jwt from "jsonwebtoken"; // Importowanie biblioteki JSON Web Token do obsługi tokenów JWT

// Przy wykonywaniu fetch na serwer, należy dodać credentials: "include" do opcji fetch
// ponieważ inaczej ciasteczka nie zostaną dołączone do żądania i token z cookie nie będzie dostępny!
export const verifyAdminToken = (req, res, next) => {
  // Definicja middleware do weryfikacji tokena admina
  const token = req.cookies.accesstoken; // Pobieranie tokena dostępu z ciasteczka o nazwie 'accesstoken'

  // Jeśli token nie istnieje, zwróć status 401 z komunikatem błędu
  if (!token) return res.status(401).json({ errors: "Not authenticated!" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // Weryfikacja tokena za pomocą sekretu zdefiniowanego w zmiennych środowiskowych
    // Jeśli weryfikacja tokena się nie powiedzie, zwróć status 401
    if (err) return res.status(401).json({ errors: "Not authenticated!" });

    if (user && user.role && user.role !== "admin")
      // Sprawdzenie, czy użytkownik ma rolę admina
      return res.status(401).json({ errors: "Not authenticated!" }); // Jeśli rola nie jest admin, zwróć status 401

    req.user = user; // Przypisanie zweryfikowanego użytkownika do obiektu żądania
    req.userId = user.id; // Przypisanie identyfikatora użytkownika do obiektu żądania
    next(); // Przejście do następnego middleware
  });
};
