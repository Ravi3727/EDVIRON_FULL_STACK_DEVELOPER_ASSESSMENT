const express = require("express")
const {
  getAllTransactions,
  getTransactionsBySchool,
  checkTransactionStatus,
} = require("../controllers/transaction.controller")
const { authenticateToken } = require("../middleware/auth.middleware")
const { validateRequest } = require("../middleware/validation.middleware")
const { z } = require("zod")

const router = express.Router()

// Validation schema for query parameters
const paginationSchema = z
  .object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? Number(val) : 10)),
    sort: z.string().optional(),
    order: z.string().optional(),
    status: z.string().optional(),
    schoolId: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && !isValidDate(data.startDate)) return false
      if (data.endDate && !isValidDate(data.endDate)) return false
      return true
    },
    {
      message: "Invalid date format",
      path: ["startDate", "endDate"],
    },
  )

// Helper function to validate date
function isValidDate(dateString) {
  return !isNaN(new Date(dateString).getTime())
}

// Get all transactions
router.get("/", authenticateToken, validateRequest(paginationSchema, "query"), getAllTransactions)

// Get transactions by school
router.get("/school/:schoolId", authenticateToken, validateRequest(paginationSchema, "query"), getTransactionsBySchool)

// Check transaction status
router.get(
  "/status/:customOrderId",
  authenticateToken,
  validateRequest(
    z.object({
      customOrderId: z.string().min(1),
    }),
    "params",
  ),
  checkTransactionStatus,
)

module.exports = router
