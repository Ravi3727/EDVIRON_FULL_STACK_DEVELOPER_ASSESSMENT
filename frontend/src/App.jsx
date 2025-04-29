"use client"

import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./contexts/AuthContext"
import Layout from "./components/Layout"
import Dashboard from "./pages/Dashboard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import TransactionsBySchool from "./pages/TransactionsBySchool"
import TransactionStatus from "./pages/TransactionStatus"
import NotFound from "./pages/NotFound"
import CreatePaymentRequest from "./pages/CreatePaymentRequest"
import PageLoader from "./components/PageLoader"
import { useState, useEffect } from "react"
import PaymentSuccess from "./pages/PaymentSuccess"


const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return children
}

function App() {
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoader(false)
    }, 2500) // Show loader for 2.5 seconds
    return () => clearTimeout(timer)
  }, [])

  if (showLoader) {
    return <PageLoader />
  }

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="transactions/school" element={<TransactionsBySchool />} />
          <Route path="transaction-status" element={<TransactionStatus />} />
          <Route path="/create-payment" element={<CreatePaymentRequest />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
