import { useCallback, useEffect, useState } from "react";
import { BACK_END_URL } from "../../constants/api";
import AutocompleteInput from "../AutocompleteInput/AutocompleteInput";

const CityInputAutocomplete = ({ voivodeship, value, onChange, onSelect }) => {
  const [citySuggestions, setCitySuggestions] = useState([]);

  const fetchCitySuggestions = useCallback(async (voivodeship, name) => {
    if (name.length < 2) return;

    try {
      const response = await fetch(
        `${BACK_END_URL}/api/v1/cities/all?name=${name}&voivodeship=${voivodeship}`
      );

      const data = await response.json();
      setCitySuggestions(data.cities.map((city) => city.name));
    } catch (error) {
      console.error("Błąd podczas zapytania do bazy miast:", error);
    }
  });

  useEffect(() => {
    if (citySuggestions.find((v) => v === value)) {
      setCitySuggestions([]);
      return;
    }

    fetchCitySuggestions(voivodeship, value);
  }, [value, voivodeship]);

  return (
    <AutocompleteInput
      suggestions={citySuggestions}
      value={value}
      onChange={onChange}
      onSelect={onSelect}
      placeholder="Wprowadź miasto"
    />
  );
};

export default CityInputAutocomplete;
