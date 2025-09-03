// import React from "react";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import AdminLayout from "./AdminLayout";
// import L from "leaflet";

// // Fix default marker icon
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
//   iconUrl: require("leaflet/dist/images/marker-icon.png"),
//   shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
// });

// const busLocations = [
//   { id: 1, name: "Bus 101", lat: 17.6599, lng: 75.9064 },
//   { id: 2, name: "Bus 202", lat: 17.6625, lng: 75.9122 },
// ];

// const LiveTracking = () => {
//   return (
//     <AdminLayout>
//       <h1 className="text-2xl font-bold mb-4">Live Bus Tracking (Leaflet)</h1>

//       <div className="rounded shadow overflow-hidden">
//         <MapContainer
//           center={[17.6599, 75.9064]} // Solapur center
//           zoom={13}
//           style={{ height: "500px", width: "100%" }}
//         >
//           <TileLayer
//             attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           />
//           {busLocations.map((bus) => (
//             <Marker key={bus.id} position={[bus.lat, bus.lng]}>
//               <Popup>
//                 {bus.name}
//                 <br />
//                 Route Status: On Time
//               </Popup>
//             </Marker>
//           ))}
//         </MapContainer>
//       </div>
//     </AdminLayout>
//   );
// };

// export default LiveTracking;


import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

// Fix default marker issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const Routing = ({ source, destination, setRouteData }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !source || !destination) return;

    const routingControl = L.Routing.control({
      waypoints: [
        L.latLng(source[0], source[1]),
        L.latLng(destination[0], destination[1]),
      ],
      routeWhileDragging: true,
      lineOptions: {
        styles: [{ color: "#1F7D53", weight: 6 }],
      },
      createMarker: (i, waypoint, n) => {
        return L.marker(waypoint.latLng).bindPopup(
          i === 0 ? "Source" : i === n - 1 ? "Destination" : "Stop"
        );
      },
    })
      .on("routesfound", function (e) {
        const route = e.routes[0];
        const summary = route.summary;

        const data = {
          totalDistance: summary.totalDistance, // meters
          totalTime: summary.totalTime, // seconds
          waypoints: route.waypoints.map((wp) => wp.latLng),
          coordinates: route.coordinates, // full path
        };

        console.log("✅ Route Data:", data);
        setRouteData(data);
      })
      .addTo(map);

    return () => map.removeControl(routingControl);
  }, [map, source, destination, setRouteData]);

  return null;
};

const LiveTracking = () => {
  const [source, setSource] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeData, setRouteData] = useState(null);

  const [srcLat, setSrcLat] = useState("17.6646");
  const [srcLng, setSrcLng] = useState("75.8934");
  const [destLat, setDestLat] = useState("17.6350");
  const [destLng, setDestLng] = useState("75.9131");

  const handleRoute = () => {
    setSource([parseFloat(srcLat), parseFloat(srcLng)]);
    setDestination([parseFloat(destLat), parseFloat(destLng)]);
  };

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Input Fields */}
      <div className="p-4 bg-gray-100 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Source Latitude"
          value={srcLat}
          onChange={(e) => setSrcLat(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Source Longitude"
          value={srcLng}
          onChange={(e) => setSrcLng(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Destination Latitude"
          value={destLat}
          onChange={(e) => setDestLat(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Destination Longitude"
          value={destLng}
          onChange={(e) => setDestLng(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          onClick={handleRoute}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Show Route
        </button>
      </div>

      {/* Map */}
      <MapContainer
        center={[17.6646, 75.8934]} // default center
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Markers */}
        {source && (
          <Marker position={source}>
            <Popup>Source</Popup>
          </Marker>
        )}
        {destination && (
          <Marker position={destination}>
            <Popup>Destination</Popup>
          </Marker>
        )}

        {/* Routing */}
        {source && destination && (
          <Routing
            source={source}
            destination={destination}
            setRouteData={setRouteData}
          />
        )}
      </MapContainer>

      {/* Show Route Data */}
      {routeData && (
        <div className="p-4 bg-gray-200">
          <h2 className="font-bold text-lg">Route Summary</h2>
          <p>🚗 Distance: {(routeData.totalDistance / 1000).toFixed(2)} km</p>
          <p>⏱ Time: {(routeData.totalTime / 60).toFixed(2)} min</p>
          <p>📍 Waypoints: {routeData.waypoints.length}</p>
        </div>
      )}
    </div>
  );
};

export default LiveTracking;

