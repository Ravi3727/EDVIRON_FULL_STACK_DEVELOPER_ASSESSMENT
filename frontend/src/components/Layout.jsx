"use client"

import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"
import Sidebar from "./Sidebar"
import { useTheme } from "../contexts/ThemeContext"

const Layout = () => {
  const { darkMode } = useTheme()

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : "light"}`}>
      <Navbar />
      <div className="md:flex ">
        <Sidebar />
        <main className="flex-1 px-3 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
