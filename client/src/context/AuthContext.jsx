// /context/AuthContext.jsx

import { createContext, useEffect, useState } from "react";

// Tworzy kontekst uwierzytelniania, który będzie przechowywał informacje o użytkowniku
// i metody do ich aktualizacji
// createContext jest funkcją z biblioteki React, która służy do tworzenia kontekstu.
// Kontekst umożliwia przekazywanie danych pomiędzy komponentami bez konieczności przekazywania
// ich przez propsy na każdym poziomie drzewa komponentów.
export const AuthContext = createContext();

// Definiuje dostawcę kontekstu, który opakowuje komponenty podrzędne
export const AuthContextProvider = ({ children }) => {
  // Używa useState do zarządzania stanem danych użytkownika.
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // Funkcja aktualizująca dane użytkownika w stanie
  const updateUserData = (data) => {
    setUserData(data);
  };

  // useEffect uruchamia się za każdym razem, gdy userData zostanie zmienione
  useEffect(() => {
    // Aktualizuje localStorage, aby przechować aktualne dane użytkownika
    localStorage.setItem("user", JSON.stringify(userData));
  }, [userData]);

  // AuthContextProvider Zwraca dostawcę kontekstu, który udostępnia
  // wartości i metody do wszystkich komponentów podrzędnych
  // Provider przyjmuje właściwość value, która określa dane,
  // jakie mają być dostępne w kontekście, czyli będą dostępne
  // w komponentach children, gdzie pobranie danych użytkownika będzie
  // bardzo proste:  const { userData } = useContext(AuthContext);
  return (
    <AuthContext.Provider value={{ userData, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};
