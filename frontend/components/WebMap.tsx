import L from 'leaflet';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const iconHtml = `
  <div style="width: 40px; height: 40px;">
    <svg viewBox="0 0 64 64" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M32 2C18 2 6 14 6 28c0 14 26 34 26 34s26-20 26-34C58 14 46 2 32 2z" fill="#E63946"/>
        <g transform="translate(20, 24)">
          <rect x="0" y="2" width="24" height="8" rx="2" ry="2" fill="#ffffff"/>
          <rect x="4" y="-4" width="16" height="8" rx="2" ry="2" fill="#ffffff"/>
          <circle cx="6" cy="10" r="3" fill="#ffffff"/>
          <circle cx="18" cy="10" r="3" fill="#ffffff"/>
        </g>
      </g>
    </svg>
  </div>
`;

const customIcon = L.divIcon({
    html: iconHtml,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

interface WebMapProps {
    latitude: number;
    longitude: number;
}

export default function WebMap({latitude, longitude}: WebMapProps) {

    return (
        <MapContainer center={[latitude, longitude]} zoom={13} style={{ height: '50vh', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[latitude, longitude]} icon={customIcon}>
            </Marker>
        </MapContainer>
    );
}