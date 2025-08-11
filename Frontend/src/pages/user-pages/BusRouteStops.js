import React, { useState, useEffect } from "react";
import {
  FaMapMarkerAlt,
  FaBus,
  FaClock,
  FaRoad,
  FaChevronRight,
  FaUsers,
} from "react-icons/fa";
import { MdDirectionsBus, MdExpandMore, MdExpandLess } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const BusRouteStops = () => {
  const [routeData, setRouteData] = useState({
    busName: "101A - City Express",
    routeNumber: "Route #SCT-101A",
    source: "Solapur Station",
    destination: "Akkalkot Road Terminal",
    stops: [],
    lastUpdated: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  });
  const [expandedStop, setExpandedStop] = useState(null);

  // Demo data - replace with your API call
  useEffect(() => {
    const demoStops = [
      {
        id: 1,
        name: "Solapur Station",
        time: "08:00 AM",
        distance: "0 km",
        status: "on-time",
        eta: "Departing now",
        passengers: "High",
        platform: "Platform 1",
      },
      {
        id: 2,
        name: "Gandhi Chowk",
        time: "08:15 AM",
        distance: "2.5 km",
        status: "on-time",
        eta: "3 min",
        passengers: "Medium",
        platform: "Stop 2",
      },
      {
        id: 3,
        name: "City Mall",
        time: "08:25 AM",
        distance: "4.2 km",
        status: "delayed",
        eta: "7 min",
        passengers: "Low",
        platform: "Stop 3",
      },
      {
        id: 4,
        name: "Medical College",
        time: "08:40 AM",
        distance: "6.8 km",
        status: "on-time",
        eta: "15 min",
        passengers: "High",
        platform: "Stop 4",
      },
      {
        id: 5,
        name: "Akkalkot Road Terminal",
        time: "09:00 AM",
        distance: "10 km",
        status: "on-time",
        eta: "25 min",
        passengers: "Medium",
        platform: "Terminal 1",
      },
    ];
    setRouteData((prev) => ({ ...prev, stops: demoStops }));
  }, []);

  const toggleStopExpand = (stopId) => {
    setExpandedStop(expandedStop === stopId ? null : stopId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      {/* Bus Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl shadow-lg p-6 mb-6 text-white"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center mb-1">
              <MdDirectionsBus className="text-2xl mr-3" />
              <h1 className="text-2xl font-bold">{routeData.busName}</h1>
            </div>
            <p className="text-blue-100 text-sm">{routeData.routeNumber}</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium">
            Live Tracking
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-blue-400/30">
          <div className="text-center">
            <div className="text-blue-200 text-sm mb-1">From</div>
            <div className="font-semibold">{routeData.source}</div>
          </div>
          <div className="mx-4">
            <FaChevronRight className="text-xl text-blue-300" />
          </div>
          <div className="text-center">
            <div className="text-blue-200 text-sm mb-1">To</div>
            <div className="font-semibold">{routeData.destination}</div>
          </div>
        </div>

        <div className="mt-4 text-sm text-blue-100 flex justify-end items-center">
          <span>Updated: {routeData.lastUpdated}</span>
        </div>
      </motion.div>

      {/* Route Timeline */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center">
          <span className="bg-blue-100 p-2 rounded-lg mr-3">
            <FaRoad className="text-blue-600" />
          </span>
          Route Timeline
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[21px] top-0 h-full w-0.5 bg-gray-200"></div>

          {routeData.stops.map((stop, index) => (
            <div key={stop.id} className="relative pl-10 pb-4 last:pb-0">
              {/* Timeline dot */}
              <motion.div
                animate={{
                  scale: expandedStop === stop.id ? [1, 1.2, 1] : 1,
                  boxShadow:
                    expandedStop === stop.id
                      ? "0 0 0 4px rgba(59, 130, 246, 0.2)"
                      : "none",
                }}
                transition={{ duration: 0.3 }}
                className={`absolute left-2 top-4 w-7 h-7 rounded-full flex items-center justify-center z-10
                  ${
                    index === 0
                      ? "bg-green-500"
                      : index === routeData.stops.length - 1
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
              >
                {index === 0 ? (
                  <FaMapMarkerAlt className="text-white text-[8px]" />
                ) : index === routeData.stops.length - 1 ? (
                  <FaMapMarkerAlt className="text-white text-[8px]" />
                ) : (
                  <FaBus className="text-white text-[8px]" />
                )}
              </motion.div>

              {/* Stop card */}
              <motion.div
                whileHover={{ y: -2 }}
                className={`bg-white border border-gray-200 rounded-xl p-4 transition-all duration-200 cursor-pointer
                  ${
                    expandedStop === stop.id
                      ? "ring-2 ring-blue-200 shadow-md"
                      : "shadow-sm hover:shadow-md"
                  }`}
                onClick={() => toggleStopExpand(stop.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full mr-3 ${
                        stop.status === "on-time"
                          ? "bg-green-400"
                          : "bg-yellow-400"
                      }`}
                    ></div>
                    <h3 className="font-medium text-gray-900">{stop.name}</h3>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="flex items-center mr-4">
                      <FaClock className="mr-1 text-gray-400" />
                      <span>{stop.time}</span>
                    </div>
                    <div className="flex items-center">
                      <FaRoad className="mr-1 text-gray-400" />
                      <span>{stop.distance}</span>
                    </div>
                    {expandedStop === stop.id ? (
                      <MdExpandLess className="ml-3 text-gray-500" />
                    ) : (
                      <MdExpandMore className="ml-3 text-gray-500" />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedStop === stop.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-gray-200 text-sm">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-gray-500 mb-1 flex items-center">
                              <FaClock className="mr-2" />
                              ETA
                            </div>
                            <div className="font-medium">{stop.eta}</div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="text-gray-500 mb-1 flex items-center">
                              <FaUsers className="mr-2" />
                              Passenger Load
                            </div>
                            <div
                              className={`font-medium ${
                                stop.passengers === "High"
                                  ? "text-red-500"
                                  : stop.passengers === "Medium"
                                  ? "text-yellow-500"
                                  : "text-green-500"
                              }`}
                            >
                              {stop.passengers}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                          <div className="text-gray-500 mb-1">Platform</div>
                          <div className="font-medium">{stop.platform}</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Help text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-xs text-gray-400 text-center mt-6"
      >
        Tap on any stop for detailed information
      </motion.div>
    </div>
  );
};

export default BusRouteStops;
