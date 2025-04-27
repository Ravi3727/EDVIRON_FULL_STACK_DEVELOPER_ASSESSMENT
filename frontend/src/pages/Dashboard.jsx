"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { FiFilter, FiChevronLeft, FiChevronRight, FiDownload } from "react-icons/fi"
import { format } from "date-fns"
import { FaRegCopy } from 'react-icons/fa';
import TransactionAmountDisplayCard from "../components/TransactionAmountDisplayCard"
import NumberOfTransactionCard from "../components/NumberOfTransactionCard"
import NumberOfSchools from "../components/NumberOfSchools"

const Dashboard = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [todayTransactionAmount, setTodayTransactionAmount] = useState(0);
  const [totalTransactionsAmount, setTotalTransactionsAmount] = useState(0);
  const [totdayNumberOfTransactions, setTodayNumberOfTransactions] = useState(0);
  const [totalNumberOfTransactions, setTotalNumberOfTransactions] = useState(0);
  const [totalNumberOfSchools, setTotalNumberOfSchools] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  })

  // Filters
  const [filters, setFilters] = useState({
    status: "",
    schoolId: "",
    startDate: "",
    endDate: "",
  })

  // Sorting
  const [sortField, setSortField] = useState("payment_time")
  const [sortOrder, setSortOrder] = useState("desc")

  // Filter visibility
  const [showFilters, setShowFilters] = useState(false)

  const fetchTransactions = async () => {
    try {
      setLoading(true)

      let url = `${import.meta.env.VITE_API_URL}/transactions?page=${pagination.page}&limit=${pagination.limit}&sort=${sortField}&order=${sortOrder}`

      // Add filters to URL if they exist
      if (filters.status) url += `&status=${filters.status}`
      if (filters.schoolId) url += `&schoolId=${filters.schoolId}`
      if (filters.startDate) url += `&startDate=${filters.startDate}`
      if (filters.endDate) url += `&endDate=${filters.endDate}`

      const response = await axios.get(url, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })


      setTransactions(response.data.transactions)
      // console.log(response.data.transactions)
      setPagination(response.data.pagination)

      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch transactions")
      setTransactions([])
    } finally {
      setLoading(false)
    }
  }


  const fetchSummary = async () => {
    let url2 = `${import.meta.env.VITE_API_URL}/transactions?page=${0}&limit=${20}&sort=${sortField}&order=${sortOrder}`
    try {
      const response = await axios.get(url2, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      })
      let totalAmount = 0;
      let todayAmount = 0;
      const today = new Date();
      const schoolIdSet = new Set();
      let todayTransactionCount = 0;

      response.data.transactions.forEach(transaction => {
        const amount = Number(transaction.transaction_amount) || 0;

        totalAmount += amount;

        const transactionDate = new Date(transaction.payment_time);

        if (
          transactionDate.getDate() === today.getDate() &&
          transactionDate.getMonth() === today.getMonth() &&
          transactionDate.getFullYear() === today.getFullYear()
        ) {
          todayAmount += amount;
          todayTransactionCount++;
        }

        schoolIdSet.add(transaction.school_id);
      });

      setTotalTransactionsAmount(totalAmount);
      setTodayTransactionAmount(todayAmount);
      setTotalNumberOfTransactions(response.data.transactions.length);
      setTotalNumberOfSchools(schoolIdSet.size);
      setTodayNumberOfTransactions(todayTransactionCount);
    } catch {
      setError(err.response?.data?.message || "Failed to fetch transactions")
      setTransactions([])
    }
  }


  useEffect(() => {
    fetchTransactions();
    fetchSummary();
  }, [pagination.page, pagination.limit, sortField, sortOrder])

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const applyFilters = (e) => {
    e.preventDefault()
    setPagination((prev) => ({ ...prev, page: 1 }))
    fetchTransactions()
  }

  const resetFilters = () => {
    setFilters({
      status: "",
      schoolId: "",
      startDate: "",
      endDate: "",
    })
    setPagination((prev) => ({ ...prev, page: 1 }))
    fetchTransactions()
  }

  const exportToCSV = () => {
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
    link.setAttribute("download", `transactions_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    navigator.clipboard.writeText(e)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }


  return (
    <div className="container mx-auto ">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Transactions Overview</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-gray-400 dark:bg-gray-700 text-black dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <FiFilter className="mr-2" /> Filters
          </button>
          <button
            onClick={exportToCSV}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiDownload className="mr-2" /> Export
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-md shadow-md mb-6 ">
          <form onSubmit={applyFilters} className="flex flex-col justify-evenly gap-4">
            <div className="min-w-full flex justify-evenly">


              <div className="w-1/5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                >
                  <option value="">All Statuses</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>



              <div className="w-1/5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={filters.startDate}
                  onChange={handleFilterChange}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                />
              </div>

              <div className="w-1/5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">School ID</label>
                <input
                  type="text"
                  name="schoolId"
                  value={filters.schoolId}
                  onChange={handleFilterChange}
                  placeholder="Enter School ID"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="md:col-span-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-400 dark:bg-gray-700 text-black dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Reset
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Summary of data */}
      <div className="w-full flex justify-evenly items-center px-4 py-6 ">
        <div>
          <TransactionAmountDisplayCard totalAmount={totalTransactionsAmount} todayAmount={todayTransactionAmount} />
        </div>
        <div>
          <NumberOfTransactionCard totalTransactions={totalNumberOfTransactions} todayTransactions={totdayNumberOfTransactions} />
        </div>
        <div>
          <NumberOfSchools totalSchools={totalNumberOfSchools} />
        </div>
      </div>

      {/* Transactions Table */}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <div className="md:overflow-x-hidden md:overflow-y-hidden overflow-auto">
          <table className="md:min-w-full divide-gray-200 dark:divide-gray-700 ">
            <thead className="bg-gray-200 dark:bg-gray-700 rounded-xl">
              <tr className="">
                <th
                  scope="col"
                  className="rounded-l-lg px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                >
                  Sr.No
                </th>
                <th
                  scope="col"
                  className="px-3 py-6 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("collect_id")}
                >
                  Collect ID
                  {sortField === "collect_id" && <span className="ml-1 text-xl text-white">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("school_id")}
                >
                  School ID
                  {sortField === "school_id" && <span className="ml-1 text-xl text-white">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("gateway")}
                >
                  Gateway
                  {sortField === "gateway" && <span className="ml-1 text-xl text-white">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("order_amount")}
                >
                  Order Amount
                  {sortField === "order_amount" && <span className="ml-1 text-xl text-white">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("transaction_amount")}
                >
                  Transaction Amount
                  {sortField === "transaction_amount" && (
                    <span className="ml-1 text-xl text-white">{sortOrder === "asc" ? "↑" : "↓"}</span>
                  )}
                </th>
                <th
                  scope="col"
                  className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  Status
                  {sortField === "status" && <span className="ml-1 text-xl text-white">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("custom_order_id")}
                >
                  Custom Order ID
                  {sortField === "custom_order_id" && <span className="ml-1 text-xl text-white">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </th>
                <th
                  scope="col"
                  className="rounded-r-lg px-2 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("payment_time")}
                >
                  Payment Time
                  {sortField === "payment_time" && <span className="ml-1 text-xl text-white">{sortOrder === "asc" ? "↑" : "↓"}</span>}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-red-500">
                    {error}
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                // Use mockTransactions for development, replace with transactions in production
                transactions.map((transaction, index) => (
                  <tr key={transaction.collect_id} className="hover-effect-row mt-2  p-2">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 ml-2">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {transaction.collect_id}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      {transaction.school_id}
                      <FaRegCopy
                        onClick={() => handleCopy(transaction.school_id)}

                        className="cursor-pointer hover:text-green-500"

                      />

                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 max-w-28">
                      {transaction.gateway}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      ₹{transaction.order_amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      ₹{transaction.transaction_amount.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${transaction.status === "success"
                          ? " text-green-400"
                          : transaction.status === "pending"
                            ? " text-yellow-400 "
                            : " text-red-400 "
                          }`}
                      >
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                      {transaction.custom_order_id}
                      <FaRegCopy
                        onClick={() => handleCopy(transaction.custom_order_id)}

                        className="cursor-pointer hover:text-green-500"

                      />

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

        <div className="px-6 py-4 flex items-center justify-between border-t bg-gray-200 dark:bg-gray-700 dark:border-gray-700 rounded-lg">
          <div className="flex items-center">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Showing page {pagination.page} of {pagination.pages || 1}
            </span>
            <select
              value={pagination.limit}
              onChange={(e) => setPagination({ ...pagination, limit: Number(e.target.value), page: 1 })}
              className="ml-2 p-1 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span className="ml-1 text-sm text-gray-700 dark:text-gray-300">per page</span>
          </div>

          <div className="flex items-center space-x-2 ">
            <button
              onClick={() => setPagination({ ...pagination, page: Math.max(1, pagination.page - 1) })}
              disabled={pagination.page <= 1}
              className={`p-2 rounded-md ${pagination.page <= 1
                ? "bg-gray-200 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500"
                }`}
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPagination({ ...pagination, page: Math.min(pagination.pages, pagination.page + 1) })}
              disabled={pagination.page >= pagination.pages}
              className={`p-2 rounded-md ${pagination.page >= pagination.pages
                ? "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 cursor-not-allowed"
                : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500"
                }`}
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Dashboard;
