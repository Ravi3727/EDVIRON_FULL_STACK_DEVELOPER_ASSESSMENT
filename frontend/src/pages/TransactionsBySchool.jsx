"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { FiSearch, FiChevronLeft, FiChevronRight, FiDownload } from "react-icons/fi"
import { format } from "date-fns"

const TransactionsBySchool = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [schoolId, setSchoolId] = useState("")
  const [searchPerformed, setSearchPerformed] = useState(false)

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })

  // Sorting
  const [sortField, setSortField] = useState("payment_time")
  const [sortOrder, setSortOrder] = useState("desc")

  const fetchTransactions = async () => {
    if (!schoolId.trim()) {
      setError("Please enter a School ID")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const url = `${import.meta.env.VITE_API_URL}/transactions/school/${schoolId}?page=${pagination.page}&limit=${pagination.limit}&sort=${sortField}&order=${sortOrder}`

      const response = await axios.get(url,
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      )

      setTransactions(response.data.transactions)
      setPagination(response.data.pagination)
      
      setSearchPerformed(true)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch transactions")
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (searchPerformed && schoolId) {
      fetchTransactions()
    }
  }, [pagination.page, pagination.limit, sortField, sortOrder])

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setPagination({ ...pagination, page: 1 }) // Reset to first page
    fetchTransactions()
  }

  const exportToCSV = () => {
    if (transactions.length === 0) return

    // Create CSV content
    const headers = [
      "Collect ID",
      "School ID",
      "Gateway",
      "Order Amount",
      "Transaction Amount",
      "Status",
      "Custom Order ID",
    ]
    const csvContent = [
      headers.join(","),
      ...transactions.map((t) =>
        [t.collect_id, t.school_id, t.gateway, t.order_amount, t.transaction_amount, t.status, t.custom_order_id].join(
          ",",
        ),
      ),
    ].join("\n")

    // Create download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `school_${schoolId}_transactions_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Mock data for development
  // const mockTransactions = [
  //   {
  //     collect_id: "60d21b4667d0d8992e610c85",
  //     school_id: "65b0e6293e9f76a9694d84b4",
  //     gateway: "PhonePe",
  //     order_amount: 2000,
  //     transaction_amount: 2200,
  //     status: "success",
  //     custom_order_id: "ORDER_1234567890",
  //     payment_time: "2025-04-23T08:14:21.945Z",
  //   },
  //   {
  //     collect_id: "60d21b4667d0d8992e610c86",
  //     school_id: "65b0e6293e9f76a9694d84b4",
  //     gateway: "PayTM",
  //     order_amount: 1500,
  //     transaction_amount: 1650,
  //     status: "pending",
  //     custom_order_id: "ORDER_1234567891",
  //     payment_time: "2025-04-22T10:24:11.945Z",
  //   },
  // ]

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Transactions by School</h1>
        {transactions.length > 0 && (
          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiDownload className="mr-2" /> Export
          </button>
        )}
      </div>

      <div className="bg-gray-300 dark:bg-gray-800 p-4 rounded-md shadow-md mb-6">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">School ID</label>
            <input
              type="text"
              value={schoolId}
              onChange={(e) => setSchoolId(e.target.value)}
              placeholder="Enter School ID"
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
                "Searching..."
              ) : (
                <>
                  <FiSearch className="mr-2" /> Search
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

      {searchPerformed && !loading && !error && (
        <div className="bg-white dark:bg-gray-800 rounded-md shadow-md overflow-hidden">
          <div className="overflow-x-hidden overflow-y-hidden">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("collect_id")}
                  >
                    Collect ID
                    {sortField === "collect_id" && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("gateway")}
                  >
                    Gateway
                    {sortField === "gateway" && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("order_amount")}
                  >
                    Order Amount
                    {sortField === "order_amount" && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("transaction_amount")}
                  >
                    Transaction Amount
                    {sortField === "transaction_amount" && (
                      <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>
                    )}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("status")}
                  >
                    Status
                    {sortField === "status" && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("custom_order_id")}
                  >
                    Custom Order ID
                    {sortField === "custom_order_id" && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("payment_time")}
                  >
                    Payment Time
                    {sortField === "payment_time" && <span className="ml-1">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                      No transactions found for this school
                    </td>
                  </tr>
                ) : (
                  // Use mockTransactions for development, replace with transactions in production
                  transactions.map((transaction) => (
                    <tr key={transaction.collect_id} className="hover-effect-row">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {transaction.collect_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {transaction.gateway}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        ₹{transaction.order_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        ₹{transaction.transaction_amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status === "success"
                              ? " text-green-400"
                              : transaction.status === "pending"
                                ? " text-yellow-400"
                                : " text-red-400 "  
                          }`}
                        >
                          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {transaction.custom_order_id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {format(new Date(transaction.payment_time), "MMM dd, yyyy HH:mm")}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {transactions.length > 0 && (
            <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  Showing page {pagination.page} of {pagination.pages || 1}
                </span>
                <select
                  value={pagination.limit}
                  onChange={(e) => setPagination({ ...pagination, limit: Number(e.target.value), page: 1 })}
                  className="ml-2 p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
                <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">per page</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
                  disabled={pagination.page <= 1}
                  className={`p-2 rounded-md ${
                    pagination.page <= 1
                      ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500"
                  }`}
                >
                  <FiChevronLeft size={18} />
                </button>
                <button
                  onClick={() =>
                    setPagination({ ...pagination, page: Math.min(pagination.pages, pagination.page + 1) })
                  }
                  disabled={pagination.page >= pagination.pages}
                  className={`p-2 rounded-md ${
                    pagination.page >= pagination.pages
                      ? "bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500"
                  }`}
                >
                  <FiChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TransactionsBySchool
