import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import { toast } from "react-toastify";
import {
  FiEdit,
  FiTrash2,
  FiPlus,
  FiX,
  FiMapPin,
  FiClock,
} from "react-icons/fi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axiosInstance from "../../utils/axiosInstance";

const ManageRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [uniqueSources, setUniqueSources] = useState([]);
  const [uniqueDestinations, setUniqueDestinations] = useState([]);

  const [form, setForm] = useState({
    source: "",
    destination: "",
    via: "",
    distance: "",
    estimatedDuration: "",
    trips: [
      {
        sourceTime: "",
        destinationTime: "",
        stops: [],
      },
    ],
  });

  const [newStop, setNewStop] = useState({
    name: "",
    timingOffset: "",
    latitude: "",
    longitude: "",
    sequence: 0,
  });

  const [editingRouteId, setEditingRouteId] = useState(null);
  const [currentTripIndex, setCurrentTripIndex] = useState(0);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/routes");
      setRoutes(res.data);

      // Fetch unique sources and destinations for suggestions
      const stopsRes = await axiosInstance.get("/routes");
      setUniqueSources(stopsRes.data.sources);
      setUniqueDestinations(stopsRes.data.destinations);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch routes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleTripChange = (e, tripIndex) => {
    const { name, value } = e.target;
    const updatedTrips = [...form.trips];
    updatedTrips[tripIndex] = { ...updatedTrips[tripIndex], [name]: value };
    setForm({ ...form, trips: updatedTrips });
  };

  const handleStopChange = (e) => {
    const { name, value } = e.target;
    setNewStop({ ...newStop, [name]: value });
  };

  const addTrip = () => {
    setForm({
      ...form,
      trips: [
        ...form.trips,
        {
          sourceTime: "",
          destinationTime: "",
          stops: [],
        },
      ],
    });
    setCurrentTripIndex(form.trips.length);
  };

  const removeTrip = (index) => {
    if (form.trips.length <= 1) {
      toast.error("At least one trip is required");
      return;
    }
    const updatedTrips = form.trips.filter((_, i) => i !== index);
    setForm({ ...form, trips: updatedTrips });
    setCurrentTripIndex(Math.min(currentTripIndex, updatedTrips.length - 1));
  };

  const addStop = () => {
    if (!newStop.name || !newStop.timingOffset) {
      toast.error("Stop name and timing offset are required");
      return;
    }

    const updatedTrips = [...form.trips];
    const sequence = updatedTrips[currentTripIndex].stops.length + 1;
    updatedTrips[currentTripIndex].stops = [
      ...updatedTrips[currentTripIndex].stops,
      { ...newStop, sequence },
    ];

    setForm({ ...form, trips: updatedTrips });
    setNewStop({
      name: "",
      timingOffset: "",
      latitude: "",
      longitude: "",
      sequence: 0,
    });
  };

  const removeStop = (stopIndex) => {
    const updatedTrips = [...form.trips];
    updatedTrips[currentTripIndex].stops = updatedTrips[
      currentTripIndex
    ].stops.filter((_, i) => i !== stopIndex);
    // Update sequence numbers
    updatedTrips[currentTripIndex].stops = updatedTrips[
      currentTripIndex
    ].stops.map((stop, idx) => ({ ...stop, sequence: idx + 1 }));
    setForm({ ...form, trips: updatedTrips });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // Validate at least one stop per trip
      for (const trip of form.trips) {
        if (!trip.sourceTime || !trip.destinationTime) {
          throw new Error("Each trip must have source and destination times");
        }
        if (trip.stops.length === 0) {
          throw new Error("Each trip must have at least one stop");
        }
      }

      if (editingRouteId) {
        await axiosInstance.put(`/routes/${editingRouteId}`, form);
        toast.success("Route updated successfully");
      } else {
        await axiosInstance.post("/routes", form);
        toast.success("Route added successfully");
      }

      fetchRoutes();
      resetForm();
      setShowForm(false);
    } catch (err) {
      toast.error(
        err.message || err.response?.data?.message || "Failed to save route"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (route) => {
    setEditingRouteId(route._id);
    setForm({
      source: route.source,
      destination: route.destination,
      via: route.via || "",
      distance: route.distance || "",
      estimatedDuration: route.estimatedDuration || "",
      trips: route.trips || [
        {
          sourceTime: "",
          destinationTime: "",
          stops: [],
        },
      ],
    });
    setCurrentTripIndex(0);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    // if (!window.confirm("Are you sure you want to delete this route?")) return;
    try {
      setLoading(true);
      await axiosInstance.delete(`/routes/${id}`);
      toast.success("Route deleted successfully");
      fetchRoutes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete route");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      source: "",
      destination: "",
      via: "",
      distance: "",
      estimatedDuration: "",
      trips: [
        {
          sourceTime: "",
          destinationTime: "",
          stops: [],
        },
      ],
    });
    setNewStop({
      name: "",
      timingOffset: "",
      latitude: "",
      longitude: "",
      sequence: 0,
    });
    setEditingRouteId(null);
    setCurrentTripIndex(0);
  };

  const filteredRoutes = routes.filter(
    (route) =>
      route.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (route.via && route.via.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold text-gray-800">Route Management</h1>
          <div className="flex items-center gap-3">
            <div className="relative">
              <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search routes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full md:w-64"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX size={18} />
                </button>
              )}
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FiPlus size={18} />
              <span>Add Route</span>
            </button>
          </div>
        </div>

        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h2 className="font-semibold text-gray-800">
                {editingRouteId ? "Edit Route" : "Add New Route"}
              </h2>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Source Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source *
                  </label>
                  <input
                    type="text"
                    name="source"
                    value={form.source}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Enter source location"
                    list="sourceSuggestions"
                  />
                  <datalist id="sourceSuggestions">
                    {uniqueSources.map((source, index) => (
                      <option key={index} value={source} />
                    ))}
                  </datalist>
                </div>

                {/* Destination Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination *
                  </label>
                  <input
                    type="text"
                    name="destination"
                    value={form.destination}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    required
                    placeholder="Enter destination location"
                    list="destinationSuggestions"
                  />
                  <datalist id="destinationSuggestions">
                    {uniqueDestinations.map((dest, index) => (
                      <option key={index} value={dest} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Via (Optional)
                  </label>
                  <input
                    type="text"
                    name="via"
                    value={form.via}
                    onChange={handleInputChange}
                    placeholder="Via"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distance (km)
                  </label>
                  <input
                    type="number"
                    name="distance"
                    value={form.distance}
                    onChange={handleInputChange}
                    placeholder="Distance in kilometers"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Duration (min)
                  </label>
                  <input
                    type="number"
                    name="estimatedDuration"
                    value={form.estimatedDuration}
                    onChange={handleInputChange}
                    placeholder="Duration in minutes"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Trips/Schedules Section */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Trips/Schedules
                  </h3>
                  <button
                    type="button"
                    onClick={addTrip}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    <FiPlus size={14} />
                    Add Trip
                  </button>
                </div>

                {/* Trip Tabs */}
                <div className="flex overflow-x-auto mb-4 border-b border-gray-200">
                  {form.trips.map((trip, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentTripIndex(index)}
                      className={`px-4 py-2 text-sm font-medium border-b-2 ${
                        currentTripIndex === index
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      Trip {index + 1}
                      {form.trips.length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeTrip(index);
                          }}
                          className="ml-1 text-gray-400 hover:text-red-500"
                        >
                          <FiX size={14} />
                        </button>
                      )}
                    </button>
                  ))}
                </div>

                {/* Current Trip Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departure Time *
                    </label>
                    <input
                      type="time"
                      name="sourceTime"
                      value={form.trips[currentTripIndex].sourceTime || ""}
                      onChange={(e) => handleTripChange(e, currentTripIndex)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Arrival Time *
                    </label>
                    <input
                      type="time"
                      name="destinationTime"
                      value={form.trips[currentTripIndex].destinationTime || ""}
                      onChange={(e) => handleTripChange(e, currentTripIndex)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                {/* Stops for Current Trip */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-md font-semibold mb-3 text-gray-800">
                    Stops for Trip {currentTripIndex + 1}
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stop Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newStop.name}
                        onChange={handleStopChange}
                        placeholder="Stop name"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Timing Offset *
                      </label>
                      <input
                        type="text"
                        name="timingOffset"
                        value={newStop.timingOffset}
                        onChange={handleStopChange}
                        placeholder="e.g., +30 mins"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Latitude
                      </label>
                      <input
                        type="text"
                        name="latitude"
                        value={newStop.latitude}
                        onChange={handleStopChange}
                        placeholder="Latitude"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Longitude
                      </label>
                      <input
                        type="text"
                        name="longitude"
                        value={newStop.longitude}
                        onChange={handleStopChange}
                        placeholder="Longitude"
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={addStop}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm w-full"
                      >
                        Add Stop
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-md border border-gray-200 max-h-40 overflow-y-auto">
                    {form.trips[currentTripIndex].stops.length > 0 ? (
                      <ul className="divide-y divide-gray-200">
                        {form.trips[currentTripIndex].stops
                          .sort((a, b) => a.sequence - b.sequence)
                          .map((stop, index) => (
                            <li
                              key={index}
                              className="py-2 flex justify-between items-center"
                            >
                              <div>
                                <span className="font-medium">
                                  {index + 1}. {stop.name}
                                </span>
                                <span className="text-gray-500 text-sm ml-2">
                                  {stop.timingOffset}
                                </span>
                                {(stop.latitude || stop.longitude) && (
                                  <span className="text-gray-400 text-xs block">
                                    {stop.latitude}, {stop.longitude}
                                  </span>
                                )}
                              </div>
                              <button
                                type="button"
                                onClick={() => removeStop(index)}
                                className="text-red-500 hover:text-red-700 text-sm"
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400 text-sm italic">
                        No stops added yet for this trip
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Processing..."
                    : editingRouteId
                    ? "Update Route"
                    : "Add Route"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Routes Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-800">All Routes</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Via
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trips
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stops
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx}>
                      {Array.from({ length: 5 }).map((_, colIdx) => (
                        <td
                          key={colIdx}
                          className="px-6 py-4 whitespace-nowrap"
                        >
                          <Skeleton height={20} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filteredRoutes.length > 0 ? (
                  filteredRoutes.map((route) => (
                    <tr key={route._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {route.source} → {route.destination}
                        </div>
                        <div className="text-sm text-gray-500">
                          {route.distance && `${route.distance} km`}
                          {route.estimatedDuration &&
                            ` • ${route.estimatedDuration} min`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {route.via || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="space-y-1">
                          {route.trips?.map((trip, index) => (
                            <div
                              key={index}
                              className="flex items-center gap-2"
                            >
                              <FiClock className="text-gray-400 flex-shrink-0" />
                              <div>
                                {trip.sourceTime} - {trip.destinationTime}
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {route.trips?.[0]?.stops?.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {route.trips[0].stops
                              .sort((a, b) => a.sequence - b.sequence)
                              .slice(0, 3)
                              .map((stop, i) => (
                                <span
                                  key={i}
                                  className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                                >
                                  {stop.name}
                                </span>
                              ))}
                            {route.trips[0].stops.length > 3 && (
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                                +{route.trips[0].stops.length - 3} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400">No stops</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(route)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <FiEdit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(route._id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      {searchTerm
                        ? "No routes match your search"
                        : "No routes found"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ManageRoutes;
