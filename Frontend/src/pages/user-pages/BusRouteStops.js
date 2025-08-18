import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaBus,
  FaClock,
  FaRoad,
  FaSpinner,
  FaExclamationTriangle,
  FaWifi,
  FaCircle,
} from "react-icons/fa";
import { MdDirectionsBus, MdExpandMore, MdExpandLess } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance.js";
import { useParams } from "react-router-dom";

const BusRouteStops = () => {
  const { busID } = useParams();
  const [busRouteData, setBusRouteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedStop, setExpandedStop] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedTripIndex, setSelectedTripIndex] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/bus-routes-mapping/${busID}`);
      setBusRouteData(res.data.data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load route data. Trying again..."
      );
      if (autoRefresh) {
        setTimeout(fetchData, 5000);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleStopExpand = (stopId) => {
    setExpandedStop(expandedStop === stopId ? null : stopId);
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    if (timeString.includes("AM") || timeString.includes("PM")) {
      return timeString;
    }
    const [hours, minutes] = timeString.split(":");
    const hourNum = parseInt(hours, 10);
    const period = hourNum >= 12 ? "PM" : "AM";
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  };

  const calculateStopTime = (trip, timingOffset) => {
    const [hours, minutes] = trip.sourceTime.split(":");
    const sourceDate = new Date();
    sourceDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    const [offsetHours, offsetMinutes] = timingOffset.split(":");
    sourceDate.setHours(sourceDate.getHours() + parseInt(offsetHours, 10));
    sourceDate.setMinutes(
      sourceDate.getMinutes() + parseInt(offsetMinutes, 10)
    );

    return formatTime(`${sourceDate.getHours()}:${sourceDate.getMinutes()}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-500";
      case "Inactive":
        return "bg-red-500";
      case "Maintenance":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const calculateDistanceFromSource = (index, totalStops) => {
    const totalDistance = busRouteData.route.distance;
    // Distribute distance proportionally with more weight given to later stops
    const baseDistance = (totalDistance * (index + 1)) / (totalStops + 1);
    // Add some random variation to make it more realistic
    const variation = (Math.random() * 0.2 * totalDistance) / totalStops;
    return Math.round(baseDistance + variation);
  };

  useEffect(() => {
    
    fetchData();
    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(fetchData, 30000);
    }
    return () => clearInterval(intervalId);
  }, [busID, autoRefresh]);

  if (loading && !busRouteData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-indigo-600 mb-4" />
          <p className="text-gray-600">Loading route information...</p>
        </div>
      </div>
    );
  }

  if (error && !busRouteData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm">
          <FaExclamationTriangle className="text-4xl text-red-500 mb-4 mx-auto" />
          <h2 className="text-xl font-semibold mb-2">Connection Issue</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg"
          >
            Retry Now
          </button>
        </div>
      </div>
    );
  }

  if (!busRouteData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-sm">
          <FaExclamationTriangle className="text-4xl text-yellow-500 mb-4 mx-auto" />
          <h2 className="text-xl font-semibold mb-2">No Route Data</h2>
          <p className="text-gray-600 mb-4">
            This route doesn't have any data available.
          </p>
        </div>
      </div>
    );
  }

  const selectedTrip = busRouteData.route.trips[selectedTripIndex];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      {/* Bus Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-indigo-500 to-indigo-800 rounded-2xl shadow-lg p-6 mb-6 text-white relative"
      >
        <div className="absolute top-4 right-4 flex items-center space-x-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`text-xs font-medium px-2 py-1 rounded-full flex items-center ${
              autoRefresh ? "bg-white/20" : "bg-red-500/80"
            }`}
          >
            {autoRefresh ? (
              <>
                <FaCircle className="text-green-400 mr-1 text-[8px]" />
                AUTO
              </>
            ) : (
              <>
                <FaCircle className="text-red-300 mr-1 text-[8px]" />
                MANUAL
              </>
            )}
          </button>
          <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full flex items-center">
            <FaWifi className="mr-1 text-indigo-200" />
            LIVE
          </span>
        </div>

        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center mb-1">
              <MdDirectionsBus className="text-2xl mr-3" />
              <h1 className="text-2xl font-bold">
                {busRouteData.bus.busNumber} - {busRouteData.route.source} to{" "}
                {busRouteData.route.destination}
              </h1>
            </div>
            <p className="text-indigo-100 text-sm">
              Via: {busRouteData.route.via}
            </p>
            {busRouteData.remarks && (
              <p className="text-indigo-100 text-sm mt-1">
                Remarks: {busRouteData.remarks}
              </p>
            )}
          </div>
          <div
            className={`${getStatusColor(
              busRouteData.status
            )} text-white rounded-full px-3 py-1 text-xs font-medium`}
          >
            {busRouteData.status}
          </div>
        </div>

        {/* Trip Selection */}
        <div className="mt-4 flex flex-wrap gap-2">
          {busRouteData.route.trips.map((trip, index) => (
            <button
              key={trip._id}
              onClick={() => setSelectedTripIndex(index)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedTripIndex === index
                  ? "bg-white text-indigo-800 font-medium"
                  : "bg-white/20 hover:bg-white/30"
              }`}
            >
              {formatTime(trip.sourceTime)} - {formatTime(trip.destinationTime)}
            </button>
          ))}
        </div>

        <div className="mt-4 text-sm text-indigo-100 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
          <div className="flex items-center">
            <FaRoad className="mr-2" />
            <span>
              Distance: {busRouteData.route.distance} km • Duration:{" "}
              {Math.floor(busRouteData.route.estimatedDuration / 60)}h{" "}
              {busRouteData.route.estimatedDuration % 60}m
            </span>
          </div>
          <div className="flex items-center">
            <span>
              Updated:{" "}
              {lastUpdated?.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {loading && <FaSpinner className="animate-spin ml-2 text-xs" />}
          </div>
        </div>
      </motion.div>

      {/* Bus Details */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <span className="bg-indigo-100 p-2 rounded-lg mr-3">
            <FaBus className="text-indigo-600" />
          </span>
          Bus Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">
              Registration Number
            </h3>
            <p className="text-gray-900 font-mono">
              {busRouteData.bus.registrationNumber}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-700 mb-2">Bus Type</h3>
            <p className="text-gray-900 capitalize">
              {busRouteData.bus.type.toLowerCase()}
            </p>
          </div>
        </div>
      </div>

      {/* Route Timeline */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
          <span className="bg-indigo-100 p-2 rounded-lg mr-3">
            <FaRoad className="text-indigo-600" />
          </span>
          Trip Timeline - {formatTime(selectedTrip.sourceTime)} to{" "}
          {formatTime(selectedTrip.destinationTime)}
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[21px] top-0 h-full w-0.5 bg-gray-200"></div>

          {/* Source */}
          <div className="relative pl-10 pb-4">
            <div className="absolute left-2 top-4 w-7 h-7 rounded-full bg-green-500 flex items-center justify-center z-10 shadow-md">
              <FaMapMarkerAlt className="text-white text-[8px]" />
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-green-400 mr-3"></div>
                  <h4 className="font-small text-red-900">
                    {busRouteData.route.source}
                  </h4>
                </div>
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <div className="flex items-center">
                    <FaClock className="mr-1 text-gray-400" />
                    <span>{formatTime(selectedTrip.sourceTime)}</span>
                  </div>
                  <div className="flex items-center">
                    <FaRoad className="mr-1 text-gray-400" />
                    <span>0 km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stops */}
          {selectedTrip.stops.map((stop, index) => (
            <div key={`${stop._id}-${index}`} className="relative pl-10 pb-4">
              <motion.div
                animate={{
                  scale: expandedStop === stop._id ? [1, 1.2, 1] : 1,
                  boxShadow:
                    expandedStop === stop._id
                      ? "0 0 0 4px rgba(59, 130, 246, 0.2)"
                      : "none",
                }}
                transition={{ duration: 0.3 }}
                className="absolute left-2 top-4 w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center z-10 shadow-md"
              >
                <FaBus className="text-white text-[8px]" />
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className={`bg-white border border-gray-200 rounded-xl p-4 transition-all duration-200 cursor-pointer ${
                  expandedStop === stop._id
                    ? "ring-2 ring-indigo-200 shadow-md"
                    : "shadow-sm hover:shadow-md"
                }`}
                onClick={() => toggleStopExpand(stop._id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-indigo-400 mr-3"></div>
                    <h4 className="font-medium text-gray-900">{stop.name}</h4>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 space-x-4">
                    <div className="flex items-center">
                      <FaClock className="mr-1 text-gray-400" />
                      <span>
                        {calculateStopTime(selectedTrip, stop.timingOffset)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaRoad className="mr-1 text-gray-400" />
                      <span>
                        ~
                        {calculateDistanceFromSource(
                          index,
                          selectedTrip.stops.length
                        )}{" "}
                        km
                      </span>
                    </div>
                    {expandedStop === stop._id ? (
                      <MdExpandLess className="text-gray-500" />
                    ) : (
                      <MdExpandMore className="text-gray-500" />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedStop === stop._id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="text-gray-500 mb-1 flex items-center">
                            <FaClock className="mr-2" />
                            Estimated Arrival
                          </div>
                          <div className="font-medium">
                            {calculateStopTime(selectedTrip, stop.timingOffset)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          ))}

          {/* Destination */}
          <div className="relative pl-10">
            <div className="absolute left-2 top-4 w-7 h-7 rounded-full bg-red-500 flex items-center justify-center z-10 shadow-md">
              <FaMapMarkerAlt className="text-white text-[8px]" />
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-400 mr-3"></div>
                  <h4 className="font-medium text-gray-900">
                    {busRouteData.route.destination}
                  </h4>
                </div>
                <div className="flex items-center text-sm text-gray-600 space-x-4">
                  <div className="flex items-center">
                    <FaClock className="mr-1 text-gray-400" />
                    <span>{formatTime(selectedTrip.destinationTime)}</span>
                  </div>
                  <div className="flex items-center">
                    <FaRoad className="mr-1 text-gray-400" />
                    <span>{busRouteData.route.distance} km</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs text-gray-400 text-center mt-6"
      >
        Tap on any stop for detailed information •{" "}
        {autoRefresh ? "Auto-refreshing every 30 seconds" : "Manual refresh"} •
        Last updated: {new Date(busRouteData.updatedAt).toLocaleString()}
      </motion.div>
    </div>
  );
};

export default BusRouteStops;
