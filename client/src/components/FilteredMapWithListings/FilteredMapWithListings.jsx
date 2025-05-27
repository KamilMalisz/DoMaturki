// src/components/FilteredMapWithListings/FilteredMapWithListings.jsx

import { useEffect, useState, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
  BACK_END_URL,
  PROPERTY_TYPES,
  ROOMS_OPTIONS,
  TYPE_OPTIONS,
} from "../../constants/api";
import { NavLink } from "react-router-dom";
import styles from "./FilteredMapWithListings.module.css";
import { formatPricePLN } from "../../utils/formatPrice";

function FilteredMapWithListings({ initialLat, initialLng, initialZoom = 13 }) {
  // Definiujemy początkowe wartości filtrów jako stałą
  const initialFilters = {
    propertyType: "mieszkanie",
    type: "sprzedaż",
    minPrice: "",
    maxPrice: "",
    minSize: "",
    maxSize: "",
    rooms: "",
  };

  const [listings, setListings] = useState([]);
  const [bounds, setBounds] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(initialZoom);
  const [filters, setFilters] = useState(initialFilters);

  // Używamy useRef do śledzenia poprzednich wartości initialLat i initialLng
  const prevInitialLat = useRef(initialLat);
  const prevInitialLng = useRef(initialLng);

  // Używamy useRef do przechowywania instancji mapy
  const mapRef = useRef(null);

  const MIN_ZOOM_FOR_DATA = 10;

  const fetchListings = async (southWest, northEast) => {
    try {
      if (zoomLevel < MIN_ZOOM_FOR_DATA) return; // https://wiki.openstreetmap.org/wiki/Zoom_levels

      const query = new URLSearchParams({
        ...filters,
        southWest,
        northEast,
      }).toString();

      const response = await fetch(
        `${BACK_END_URL}/api/v1/listings/searchInBounds?${query}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch listings");
      }

      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error("Error fetching listings:", error);
    }
  };

  const getBoundsFromMap = (map) => {
    const bounds = map.getBounds();

    const southWest = [
      bounds.getSouthWest().lat,
      bounds.getSouthWest().lng,
    ].join(",");

    const northEast = [
      bounds.getNorthEast().lat,
      bounds.getNorthEast().lng,
    ].join(",");

    return { southWest, northEast };
  };

  const generatePopupContent = (listing) => {
    const price = formatPricePLN(listing.price);
    const pricePerMeter = formatPricePLN(listing.price / listing.size);
    const rooms = listing.rooms;
    const size = `${listing.size} m²`;
    const floor = listing.floor;

    return (
      <div className={styles.listingPopup}>
        <div>
          <strong>{listing.title}</strong>
        </div>
        <div>
          <img
            className={styles.listingPopupImg}
            key={listing.imageUrls}
            src={`${BACK_END_URL}${listing.imageUrls[0]}`}
            alt="image"
          />
        </div>
        <div>
          <strong>Cena:</strong> {price}
        </div>
        <div>
          <strong>Ilość pokoi:</strong> {rooms}
        </div>
        <div>
          <strong>Metraż:</strong> {size}
        </div>
        <div>
          <strong>Cena za m²:</strong> {pricePerMeter}
        </div>
        <div>
          <strong>Piętro:</strong> {floor}
        </div>
        <div>
          <NavLink to={`/listing/${listing._id}`}>Zobacz więcej</NavLink>
        </div>
      </div>
    );
  };

  const MapEvents = () => {
    const map = useMapEvents({
      moveend: () => {
        setBounds(getBoundsFromMap(map));
        setZoomLevel(map.getZoom());
      },
    });

    return null;
  };

  // Modyfikujemy MapUpdater, aby aktualizował widok mapy tylko wtedy, gdy zmienią się initialLat lub initialLng
  const MapUpdater = () => {
    const map = useMap();

    useEffect(() => {
      if (
        map &&
        (prevInitialLat.current !== initialLat ||
          prevInitialLng.current !== initialLng)
      ) {
        // Ustawiamy nowy widok mapy
        map.setView([initialLat, initialLng], initialZoom);

        // Aktualizujemy poprzednie wartości
        prevInitialLat.current = initialLat;
        prevInitialLng.current = initialLng;

        // Pobieramy nowe bounds i zoomLevel
        const newBounds = getBoundsFromMap(map);
        setBounds(newBounds);
        setZoomLevel(map.getZoom());

        // Pobieramy oferty dla nowego miasta
        if (map.getZoom() >= MIN_ZOOM_FOR_DATA) {
          fetchListings(newBounds.southWest, newBounds.northEast);
        }
      }
    }, [map, initialLat, initialLng, initialZoom]);

    return null;
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = () => {
    if (bounds) {
      fetchListings(bounds.southWest, bounds.northEast);
    }
  };

  // Resetujemy filtry po zmianie miasta
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialLat, initialLng]);

  // Pobieramy oferty po zmianie bounds, zoomLevel lub filtrów
  useEffect(() => {
    if (bounds && zoomLevel >= MIN_ZOOM_FOR_DATA) {
      fetchListings(bounds.southWest, bounds.northEast);
    }
  }, [bounds, zoomLevel, filters]);

  return (
    <div>
      <div className={styles.filterForm}>
        <div className={styles.filterField}>
          <label htmlFor="propertyTypeSelect">Przedmiot:</label>
          <select
            name="propertyType"
            id="propertyTypeSelect"
            onChange={handleFilterChange}
            value={filters.propertyType}
          >
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.filterField}>
          <label htmlFor="typeSelect">Forma:</label>
          <select
            name="type"
            id="typeSelect"
            onChange={handleFilterChange}
            value={filters.type}
          >
            {TYPE_OPTIONS.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
       {/* <div className={styles.filterField}>
          <label>Powierzchnia w m²:</label>
          <div className={styles.filterRow}>
            <input
              type="text"
              name="minSize"
              placeholder="Minimalna"
              onChange={handleFilterChange}
              value={filters.minSize}
            />
            <input
              type="text"
              name="maxSize"
              placeholder="Maksymalna"
              onChange={handleFilterChange}
              value={filters.maxSize}
            />
          </div>
        </div> */}
        <div className={styles.filterField}>
          <label>Cena w zł:</label>
          <div className={styles.filterRow}>
            <input
              type="text"
              name="minPrice"
              placeholder="Od"
              onChange={handleFilterChange}
              value={filters.minPrice}
            />
            <input
              type="text"
              name="maxPrice"
              placeholder="Do"
              onChange={handleFilterChange}
              value={filters.maxPrice}
            />
          </div>
        </div>
       {/* <div className={`${styles.filterField} ${styles.filterFieldSmall}`}>
          <label>Ilość pokoi:</label>
          <select
            name="rooms"
            onChange={handleFilterChange}
            value={filters.rooms}
          >
            <option value=""> </option>
            {ROOMS_OPTIONS.map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div> */}
        <div className={styles.filterFieldButton}>
          <button className={styles.filterButton} onClick={handleSearch}>
            Szukaj
          </button>
        </div>
      </div>
      <MapContainer
        center={[initialLat, initialLng]}
        zoom={initialZoom}
        style={{ height: "600px", width: "100%" }}
        whenReady={(mapInstance) => {
          const map = mapInstance.target;

          mapRef.current = map;

          const initialBounds = getBoundsFromMap(map);
          setBounds(initialBounds);
          setZoomLevel(map.getZoom());

          // Pobieramy oferty dla początkowego widoku mapy
          if (map.getZoom() >= MIN_ZOOM_FOR_DATA) {
            fetchListings(initialBounds.southWest, initialBounds.northEast);
          }
        }}
      >
        <MapUpdater />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {listings.map((listing) => (
          <Marker
            key={listing._id}
            position={[listing.latitude, listing.longitude]}
          >
            <Popup>{generatePopupContent(listing)}</Popup>
          </Marker>
        ))}
        <MapEvents />
      </MapContainer>
    </div>
  );
}

export default FilteredMapWithListings;
