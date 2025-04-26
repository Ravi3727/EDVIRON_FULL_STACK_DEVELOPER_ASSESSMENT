"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { FiMenu, FiMoon, FiSun, FiLogOut, FiUser } from "react-icons/fi"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"

const Navbar = () => {
  const { currentUser, logout } = useAuth()
  const { darkMode, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-blue-600 dark:bg-gray-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex items-center justify-between h-16 ">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 font-bold text-xl">
              School Payment System
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-white hover:bg-blue-700 dark:hover:bg-gray-700 focus:outline-none"
              >
                {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
              </button>

              <div className="ml-3 relative">
                <div className="flex items-center">
                  <span className="mr-2">{currentUser?.username}</span>
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center justify-center p-2 rounded-full text-white hover:bg-blue-700 dark:hover:bg-gray-700 focus:outline-none"
                  >
                    <FiUser size={20} />
                  </button>
                </div>

                {isMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 z-10">
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center"
                    >
                      <FiLogOut className="mr-2" /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-white hover:bg-blue-700 dark:hover:bg-gray-700 focus:outline-none mr-2"
            >
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-full text-white hover:bg-blue-700 dark:hover:bg-gray-700 focus:outline-none"
            >
              <FiMenu size={20} />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-500 dark:bg-gray-700">
            <div className="px-3 py-2 text-white">Signed in as: {currentUser?.username}</div>
            <button
              onClick={logout}
              className="w-full text-left block px-3 py-2 rounded-md text-white hover:bg-blue-700 dark:hover:bg-gray-600"
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
