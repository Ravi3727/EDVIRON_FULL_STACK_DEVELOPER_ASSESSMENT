import { NavLink } from "react-router-dom"
import { FiHome, FiSearch } from "react-icons/fi"
import { MdOutlineDashboard } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";


const Sidebar = () => {
  return (
    <aside className="max-w-48 bg-gray-100 dark:bg-gray-800 h-screen sticky top-0 hidden md:block">
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">Dashboard</h2>
        <nav className="space-y-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`
            }
          >
            <FiHome className="mr-3" size={18} />
            Create Payment
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`
            }
          >
          
            <MdOutlineDashboard  className="mr-3" size={18}/>
            Dashboard
          </NavLink>

          <NavLink
            to="/transactions/school"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`
            }
          >
           
            <GrTransaction className="mr-3" size={18} />
            School Transactions
          </NavLink>

          <NavLink
            to="/transaction-status"
            className={({ isActive }) =>
              `flex items-center px-4 py-2 rounded-md transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`
            }
          >
            <FiSearch className="mr-3" size={18} />
            Check Status
          </NavLink>
        </nav>
      </div>
    </aside>
  )
}

export default Sidebar
