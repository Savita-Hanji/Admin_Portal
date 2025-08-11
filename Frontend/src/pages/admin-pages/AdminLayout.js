import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiLogOut,
  FiHome,
  FiMap,
  FiUsers,
  FiTruck,
  FiCpu,
  FiChevronDown,
  FiChevronUp,
  FiSettings,
} from "react-icons/fi";
import { toast } from "react-toastify";

import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../../slices/authSlice";

const navItems = [
  {
    path: "/admin/dashboard",
    label: "Dashboard",
    icon: <FiHome />,
    exact: true,
  },
  {
    path: "/admin/buses",
    label: "Buses",
    icon: <FiTruck />,
    submenu: [
      { path: "/admin/buses", label: "Manage Buses" },
      { path: "/admin/bus-pos-mapping", label: "POS Mapping" },
      { path: "/admin/manage-bus-route-mapping", label: "Route Mapping" },
    ],
  },
  {
    path: "/admin/routes",
    label: "Routes",
    icon: <FiMap />,
    submenu: [
      { path: "/admin/routes", label: "Manage Routes" },
      { path: "/admin/live-tracking", label: "Live Tracking" },
    ],
  },
  {
    path: "/admin/pos-machines",
    label: "POS Machines",
    icon: <FiCpu />,
    exact: true,
  },
  {
    path: "/admin/all-users",
    label: "Users",
    icon: <FiUsers />,
    exact: true,
  },
  {
    path: "/admin/settings",
    label: "Settings",
    icon: <FiSettings />,
    exact: true,
  },
];

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.auth);

  const [expandedMenus, setExpandedMenus] = React.useState({});

  // Redirect non-admins or unauthenticated users
  // useEffect(() => {
  //   if (!loading) {
  //     if (!user) {
  //       navigate("/admin/login", { replace: true });
  //     } else if (user.role.toLowerCase() !== "admin") {
  //       toast.error("Access denied. Admins only.");
  //       navigate("/login", { replace: true }); // redirect regular users to user login or home
  //     }
  //   }
  // }, [user, loading, navigate]);

  const toggleMenu = (label) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error || "Logout failed");
    }
  };

  const isActive = (path, exact = false) => {
    return exact
      ? location.pathname === path
      : location.pathname.startsWith(path);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col p-4 space-y-2 sticky top-0 h-screen shadow-lg transition-all duration-300">
        <div className="p-4 mb-4">
          <h2 className="text-2xl font-bold tracking-tight flex items-center">
            <span className="bg-blue-600 text-white p-2 rounded-lg mr-3">
              <FiHome />
            </span>
            Admin Panel
          </h2>
          {user && (
            <p className="text-sm mt-2 text-gray-300">
              Hello, {user.name || user.phone || "Admin"}
            </p>
          )}
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const hasSubmenu = item.submenu && item.submenu.length > 0;
            const isItemActive = isActive(item.path, item.exact);
            const isExpanded = expandedMenus[item.label] || isItemActive;

            return (
              <div key={item.path} className="space-y-1">
                <div
                  onClick={() => (hasSubmenu ? toggleMenu(item.label) : null)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition duration-200 cursor-pointer ${
                    isItemActive
                      ? "bg-gray-700 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <Link
                    to={item.path}
                    className="flex items-center flex-1"
                    onClick={(e) => hasSubmenu && e.preventDefault()}
                  >
                    <span className="mr-3 text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                  {hasSubmenu && (
                    <span className="text-gray-400">
                      {isExpanded ? <FiChevronUp /> : <FiChevronDown />}
                    </span>
                  )}
                </div>

                {hasSubmenu && isExpanded && (
                  <div className="ml-8 space-y-1">
                    {item.submenu.map((subItem) => (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={`block px-3 py-2 text-xs rounded-lg transition duration-200 ${
                          isActive(subItem.path, true)
                            ? "bg-gray-600 text-white"
                            : "text-gray-300 hover:bg-gray-600 hover:text-white"
                        }`}
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-gray-700 mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-red-400 hover:text-red-300 text-sm font-medium transition rounded-lg hover:bg-gray-700"
          >
            <FiLogOut className="mr-2 text-lg" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm px-6 py-3 sticky top-0 z-10 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-700">
            {navItems.find((item) => isActive(item.path, item.exact))?.label ||
              "Dashboard"}
          </h1>
          <div className="flex items-center space-x-4">
            {/* future: notifications, profile */}
          </div>
        </header>

        {/* Page Content */}
        <section className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="bg-white rounded-xl shadow-sm p-6 min-h-[calc(100vh-120px)]">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
