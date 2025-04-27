import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FiHome, FiSearch, FiMenu, FiX } from "react-icons/fi";
import { MdOutlineDashboard } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  const links = [
    { to: "/", icon: <FiHome size={18} />, text: "Create Payment" },
    { to: "/dashboard", icon: <MdOutlineDashboard size={18} />, text: "Dashboard" },
    { to: "/transactions/school", icon: <GrTransaction size={18} />, text: "School Transactions" },
    { to: "/transaction-status", icon: <FiSearch size={18} />, text: "Check Status" },
  ];

  return (
    <>
      {/* Hamburger for mobile */}
      <div className="md:hidden p-4 flex items-center justify-between bg-gray-100 dark:bg-gray-800 shadow-md sticky top-0 z-50">
        
        <button onClick={toggleSidebar} className="text-gray-800 dark:text-white">
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar for Desktop */}
      <aside className="w-48 bg-gray-100 dark:bg-gray-800 h-screen sticky top-0 hidden md:block">
        <div className="p-4">
          
          <nav className="space-y-2">
            {links.map(({ to, icon, text }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-md transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`
                }
              >
                <span className="mr-3">{icon}</span>
                {text}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <>
          {/* Background Overlay */}
          <div
            className="top-10 fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeSidebar}
          ></div>

          {/* Sidebar Content */}
          <div className="fixed top-0 left-0 w-64 h-full bg-gray-100 dark:bg-gray-800 shadow-lg z-50 p-6 overflow-y-auto transition-transform">
            <nav className="space-y-4">
              {links.map(({ to, icon, text }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={closeSidebar}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-md transition-colors ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`
                  }
                >
                  <span className="mr-3">{icon}</span>
                  {text}
                </NavLink>
              ))}
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Sidebar;
