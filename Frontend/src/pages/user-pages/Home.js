import React, { useState, useEffect } from "react";
import {
  FaBusAlt,
  FaUserCircle,
  FaSignOutAlt,
  FaSearch,
  FaSpinner,
  FaChevronRight,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Select from "react-select";
import axiosInstance from "../../utils/axiosInstance.js";
import busSevaLogo from "../../assets/images/bus-seva-logo.png";
import { useDispatch } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [routes, setRoutes] = useState([]); // Store all routes
  const [sourceOptions, setSourceOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [matchedBuses, setMatchedBuses] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [loadingStops, setLoadingStops] = useState(true);
  const [loadingBuses, setLoadingBuses] = useState(false);

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  // Fetch all routes
  useEffect(() => {
    const fetchStops = async () => {
      try {
        setLoadingStops(true);
        const res = await axiosInstance.get(`/routes`);

        setRoutes(res.data); // store full list

        const sources = [...new Set(res.data.map((item) => item.source))];
        setSourceOptions(
          sources.map((source) => ({
            value: source,
            label: source,
          }))
        );
      } catch (err) {
        console.error("Error fetching stops:", err);
        toast.error("Failed to load stops.");
      } finally {
        setLoadingStops(false);
      }
    };

    fetchStops();
  }, []);

  // Filter destination list when source changes
  useEffect(() => {
    if (source) {
      const filteredDestinations = routes
        .filter((r) => r.source === source)
        .map((r) => r.destination);

      const uniqueDestinations = [...new Set(filteredDestinations)];

      setDestinationOptions(
        uniqueDestinations.map((d) => ({
          value: d,
          label: d,
        }))
      );
      setDestination("");
    } else {
      setDestinationOptions([]);
    }
  }, [source, routes]);

  // Find bus for specific route
  const handleFindBus = async () => {
    if (!source || !destination || source === destination) {
      toast.warning("Please select different source and destination");
      return;
    }

    setMatchedBuses([]);

    try {
      setLoadingBuses(true);
      const res = await axiosInstance.get(`/bus-routes-mapping`);

      const filteredBuses = res.data.filter(
        (bus) =>
          bus?.route?.source === source &&
          bus?.route?.destination === destination
      );

      if (filteredBuses.length === 0) {
        toast.info("No buses found for this route");
        setMatchedBuses([]);
        return;
      }

      const sortedBuses = filteredBuses.sort((a, b) => {
        const timeA = a.timings?.[0] || "00:00";
        const timeB = b.timings?.[0] || "00:00";
        const [hA, mA] = timeA.split(":").map(Number);
        const [hB, mB] = timeB.split(":").map(Number);
        return hA * 60 + mA - (hB * 60 + mB);
      });

      setMatchedBuses(sortedBuses);
      console.log(sortedBuses, "Sorted Buses");
    } catch (err) {
      console.error("Error fetching buses:", err);
      toast.error("Error fetching buses. Please try again.");
      setMatchedBuses([]);
    } finally {
      setLoadingBuses(false);
    }
  };

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "42px",
      borderRadius: "10px",
      border: "1px solid #e2e8f0",
      boxShadow: "none",
      "&:hover": {
        borderColor: "#cbd5e0",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#2563eb"
        : state.isFocused
        ? "#f1f5f9"
        : "white",
      color: state.isSelected ? "white" : "#1e293b",
      padding: "8px 12px",
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 font-sans p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <img
                src={busSevaLogo}
                alt="Bus Seva"
                className="h-10 w-10 md:h-12 md:w-12 rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
                <span className="bg-gradient-to-r from-indigo-600  to-indigo-400 bg-clip-text text-transparent">
                  Track My Bus
                </span>
              </h1>
              <p className="text-xs md:text-sm text-gray-500 font-medium">
                Find your perfect bus route
              </p>
              <p className="text-xs text-gray-400 mt-1">{currentDate}</p>
            </div>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              aria-label="User profile"
            >
              <FaUserCircle className="text-indigo-600 text-xl" />
              <span className="hidden md:inline text-sm font-medium text-gray-700">
                Profile
              </span>
            </button>
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-md py-1 z-10 border border-gray-100">
                <button
                  onClick={() => {
                    navigate("/profile");
                    setShowProfileDropdown(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                >
                  View Profile
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Form */}
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm space-y-4 transition-all hover:shadow-md">
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-gray-800">
              Find Your Bus Route
            </h2>
            <p className="text-sm text-gray-500">
              Search for available buses between stations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FaMapMarkerAlt className="text-indigo-500" />
                Source
              </label>
              <Select
                options={sourceOptions}
                value={sourceOptions.find((opt) => opt.value === source)}
                onChange={(opt) => setSource(opt?.value)}
                placeholder="Select source"
                className="text-sm"
                isLoading={loadingStops}
                isDisabled={loadingStops}
                styles={customSelectStyles}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <FaMapMarkerAlt className="text-red-500" />
                Destination
              </label>
              <Select
                options={destinationOptions}
                value={destinationOptions.find(
                  (opt) => opt.value === destination
                )}
                onChange={(opt) => setDestination(opt?.value)}
                placeholder="Select destination"
                className="text-sm"
                isLoading={loadingStops}
                isDisabled={loadingStops || !source}
                styles={customSelectStyles}
              />
            </div>
          </div>

          <button
            onClick={handleFindBus}
            disabled={loadingBuses || loadingStops}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {loadingBuses ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <>
                <FaSearch /> Find Buses
              </>
            )}
          </button>
        </div>

        {/* Results Section */}
        {matchedBuses !== null &&
          (loadingBuses ? (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center space-y-3">
              <FaSpinner className="animate-spin text-2xl text-blue-600" />
              <p className="text-gray-600">Searching for buses...</p>
            </div>
          ) : matchedBuses.length > 0 ? (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="bg-blue-100 p-2 rounded-lg">
                    <FaBusAlt className="text-blue-600" />
                  </span>
                  Available Buses
                </h3>
                <p className="text-sm text-gray-500">
                  {matchedBuses.length}{" "}
                  {matchedBuses.length === 1 ? "route" : "routes"} found
                </p>
              </div>

              <div className="space-y-4">
                {matchedBuses.map((bus) => (
                  <div
                    key={bus._id}
                    onClick={() => navigate(`/route/${bus._id}`)}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-[#fafafa] hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm">
                          {bus?.bus?.busNumber || "N/A"}
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                          {bus?.route?.source}{" "}
                          <FaChevronRight className="inline mx-1 text-xs text-gray-400" />{" "}
                          {bus?.route?.destination}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <FaClock className="text-gray-400" />
                        {bus?.timings?.[0] || "-"}
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <span className="text-gray-400 font-medium mt-0.5">
                          Via:
                        </span>
                        <span>{bus?.route?.via || "—"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center flex flex-col items-center">
              <div className="p-4 bg-gray-50 rounded-full mb-4">
                <FaBusAlt className="text-3xl text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 mb-1">
                No buses found
              </h3>
              <p className="text-sm text-gray-500">
                No buses available between {source} and {destination}
              </p>
              <button
                onClick={() => {
                  setSource("");
                  setDestination("");
                  setMatchedBuses(null);
                }}
                className="mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Try different route
              </button>
            </div>
          ))}

        {/* Footer */}
        <footer className="text-center text-xs text-gray-500 mt-8 pb-6">
          <p>© {new Date().getFullYear()} Bus Seva. All rights reserved.</p>
          <p className="mt-1 text-gray-400">
            Making public transport accessible
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
