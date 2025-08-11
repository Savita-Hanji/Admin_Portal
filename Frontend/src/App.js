import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./slices/authSlice";
import UserRoute from "./components/UserRoute.js";
import AdminRoute from "./components/AdminRoute.js";

//Language Page
import LanguageSelector from "./components/LanguageSelector.js";

// User Pages
import CommonLogin from "./pages/user-pages/CommonLogin.js";
import SignUp from "./pages/user-pages/SignUp.js";
import Home from "./pages/user-pages/Home.js";
import Profile from "./pages/user-pages/Profile.js";
import BusRouteStops from "./pages/user-pages/BusRouteStops.js";

// Admin Pages
// import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./pages/admin-pages/AdminDashboard.js";
import LiveTracking from "./pages/admin-pages/LiveTracking.js";
import AllUsers from "./pages/admin-pages/AllUsers.js";
import ManageBusRouteMapping from "./pages/admin-pages/ManageBusRouteMapping.js";
import "leaflet/dist/leaflet.css";
import Buses from "./pages/admin-pages/Buses.js";
import ManageRoutes from "./pages/admin-pages/ManageRoutes.js";
import ManagePOSMachines from "./pages/admin-pages/ManagePosMachine.js";
import ManageBusPosMapping from "./pages/admin-pages/ManageBusPosMapping.js";
import PageNotFound from "./pages/PageNotFound.js";

const App = () => {
  const dispatch = useDispatch();
  const [languageChosen, setLanguageChosen] = useState(false);

  useEffect(() => {
    const lang = localStorage.getItem("i18nextLng");
    if (lang) setLanguageChosen(true);

    // Fetch user from backend (uses cookie)
    dispatch(fetchUser());
  }, [dispatch]);

  const handleContinue = () => {
    setLanguageChosen(true);
  };

  return (
    <>
      <Router>
        {!languageChosen ? (
          <LanguageSelector onContinue={handleContinue} />
        ) : (
          <Routes>
            {/* common route */}
            <Route path="/" element={<LanguageSelector />} />

            {/* Auth Routes */}
            <Route path="/login" element={<CommonLogin />} />
            <Route path="/register" element={<SignUp />} />

            {/* User Protected Routes */}
            <Route
              path="/home"
              element={
                <UserRoute>
                  <Home />
                </UserRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <UserRoute>
                  <Profile />
                </UserRoute>
              }
            />
            <Route
              path="/route/:busID"
              element={
                <UserRoute>
                  <BusRouteStops />
                </UserRoute>
              }
            />

            {/* Admin Auth Route */}
            {/* <Route path="/admin/login" element={<AdminLogin />} /> */}

            {/* Admin Protected Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/manage-bus-route-mapping"
              element={
                <AdminRoute>
                  <ManageBusRouteMapping />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/live-tracking"
              element={
                <AdminRoute>
                  <LiveTracking />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/all-users"
              element={
                <AdminRoute>
                  <AllUsers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/buses"
              element={
                <AdminRoute>
                  <Buses />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/routes"
              element={
                <AdminRoute>
                  <ManageRoutes />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/pos-machines"
              element={
                <AdminRoute>
                  <ManagePOSMachines />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/bus-pos-mapping"
              element={
                <AdminRoute>
                  <ManageBusPosMapping />
                </AdminRoute>
              }
            />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        )}
      </Router>

      {/* Global Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
