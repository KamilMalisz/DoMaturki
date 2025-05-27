import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

function MapPicker({
  setLatitude,
  setLongitude,
  latitude,
  longitude,
  readonly,
}) {
  const [position, setPosition] = useState([52.231641, 21.00618]);

  useEffect(() => {
    if (latitude && longitude) {
      setPosition([latitude, longitude]);
    }
  }, [latitude, longitude]);

  const MapEvents = () => {
    const map = useMap();

    useEffect(() => {
      if (latitude && longitude) {
        map.setView([latitude, longitude] /*,15 */);
      }
    }, [map]);

    map.on("click", (e) => {
      if (!readonly) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        setLatitude(lat);
        setLongitude(lng);
        map.setView([lat, lng], map.getZoom());
      }
    });

    return null;
  };

  return (
    <MapContainer
      center={position}
      zoom={15}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='https://openstreetmap.org/copyright'> OpenStreetMap </a>"
      />
      <Marker position={position} />
      <MapEvents />
    </MapContainer>
  );
}

export default MapPicker;
