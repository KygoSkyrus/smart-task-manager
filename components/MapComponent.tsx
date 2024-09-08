import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L, { Icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMapEvents } from "react-leaflet";

// Create custom DivIcon for the marker
const createCustomMarker = () => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div style="background-color: blue; width: 25px; height: 25px; border-radius: 50%; border: 2px solid white;"></div>`,
    iconSize: [25, 25],
    iconAnchor: [12, 25], // Adjust to center the marker
  });
};

interface MapComponentProps {
  location: { lat: number; lng: number } | null;
  setLocation?: (location: { lat: number; lng: number }) => void;
  isUserEventsDisabled: Boolean;
  style?: React.CSSProperties; // Add style prop
}

const MapComponent: React.FC<MapComponentProps> = ({
  location,
  setLocation,
  isUserEventsDisabled,
  style,
}) => {
  const MapEvents = ({
    setLocation,
    location,
  }: {
    setLocation?: (location: { lat: number; lng: number }) => void;
    location: { lat: number; lng: number } | null;
  }) => {
    useMapEvents({
      click(e) {
        if (setLocation && !isUserEventsDisabled) {
          setLocation(e.latlng);
        }
      },
    });
    return location ? (
      <Marker
        position={location}
        icon={
          new Icon({
            iconUrl: "/marker-icon.png",
            iconSize: [25, 25],
            iconAnchor: [12, 41],
          })
        }
      ></Marker>
    ) : null;
  };

  return (
    <MapContainer
      center={location ? location : [51.505, -0.09]}
      zoom={13}
      style={style}
      className="relative block rounded-lg border border-gray-200 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapEvents location={location} setLocation={setLocation} />
    </MapContainer>
  );
};

export default MapComponent;
