import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Uses your custom red-pin.png from the public folder
const wasteIcon = L.icon({
    iconUrl: '/red-pin.png', 
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [38, 38],
    iconAnchor: [19, 38]
});

export default function MapContainerComponent({ reports }) {
  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
      <MapContainer 
        center={[20.5937, 78.9629]} 
        zoom={5} 
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {reports.map((r) => (
          <Marker key={r._id} position={[r.location.lat, r.location.lng]} icon={wasteIcon}>
            <Popup>
              <div className="p-1">
                <h3 className="font-bold text-red-600">{r.title}</h3>
                <p className="text-xs text-gray-600">Status: <b>{r.status}</b></p>
                <button className="mt-2 bg-green-500 text-white text-[10px] px-2 py-1 rounded">
                    Mark as Resolved
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}