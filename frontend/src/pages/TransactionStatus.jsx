"use client"

import { useState } from "react"
import axios from "axios"
import { FiSearch } from "react-icons/fi"
import { format } from "date-fns"

const TransactionStatus = () => {
  const [customOrderId, setCustomOrderId] = useState("")
  const [transaction, setTransaction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const checkStatus = async (e) => {
    e.preventDefault()

    if (!customOrderId.trim()) {
      setError("Please enter a Custom Order ID")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/transactions/status/${customOrderId}`,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      )

      setTransaction(response.data)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch transaction status")
      setTransaction(null)
    } finally {
      setLoading(false)
    }
  }



  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Check Transaction Status</h1>

      <div className="bg-gray-300 dark:bg-gray-800 p-4 rounded-md shadow-md mb-6">
        <form onSubmit={checkStatus} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Custom Order ID</label>
            <input
              type="text"
              value={customOrderId}
              onChange={(e) => setCustomOrderId(e.target.value)}
              placeholder="Enter Custom Order ID"
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
              required
            />
          </div>
          <div className="self-end">
            <button
              type="submit"
              className="w-full md:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                "Checking..."
              ) : (
                <>
                  <FiSearch className="mr-2" /> Check Status
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-100 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {transaction && (
        <div className="bg-white dark:bg-gray-800 rounded-md shadow-md overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Transaction Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction ID</h3>
                  <p className="mt-1 text-lg text-gray-800 dark:text-white">{transaction.transaction_id}</p>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Collect ID</h3>
                  <p className="mt-1 text-lg text-gray-800 dark:text-white">{transaction.collect_id}</p>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">School ID</h3>
                  <p className="mt-1 text-lg text-gray-800 dark:text-white">{transaction.school_id}</p>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Gateway</h3>
                  <p className="mt-1 text-lg text-gray-800 dark:text-white">{transaction.gateway}</p>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Amount</h3>
                  <p className="mt-1 text-lg text-gray-800 dark:text-white">
                    ₹{transaction.order_amount.toFixed(2)}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Transaction Amount</h3>
                  <p className="mt-1 text-lg text-gray-800 dark:text-white">
                    ₹{transaction.transaction_amount.toFixed(2)}
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</h3>
                  <p className="mt-1">
                    <span
                      className={` py-1 inline-flex text-lg leading-5 font-semibold rounded-full ${
                        transaction.status === "success"
                          ? " text-green-400"
                          : transaction.status === "pending"
                            ? " text-yellow-400"
                            : " text-red-400"
                      }`}
                    >
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Payment Time</h3>
                  <p className="mt-1 text-lg text-gray-800 dark:text-white">
                    {format(new Date(transaction.payment_time), "MMM dd, yyyy HH:mm")}
                  </p>
                </div>
              </div>
            </div>

            {/* <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Payment Mode</p>
                  <p className="text-lg text-gray-800 dark:text-white">{transaction.payment_mode}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Payment Details</p>
                  <p className="text-lg text-gray-800 dark:text-white">{transaction.payment_details}</p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      )}
    </div>
  )
}

export default TransactionStatus
