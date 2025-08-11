import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import AdminLayout from "./AdminLayout";
import L from "leaflet";

// Fix default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const busLocations = [
  { id: 1, name: "Bus 101", lat: 17.6599, lng: 75.9064 },
  { id: 2, name: "Bus 202", lat: 17.6625, lng: 75.9122 },
];

const LiveTracking = () => {
  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Live Bus Tracking (Leaflet)</h1>

      <div className="rounded shadow overflow-hidden">
        <MapContainer
          center={[17.6599, 75.9064]} // Solapur center
          zoom={13}
          style={{ height: "500px", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {busLocations.map((bus) => (
            <Marker key={bus.id} position={[bus.lat, bus.lng]}>
              <Popup>
                {bus.name}
                <br />
                Route Status: On Time
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </AdminLayout>
  );
};

export default LiveTracking;
