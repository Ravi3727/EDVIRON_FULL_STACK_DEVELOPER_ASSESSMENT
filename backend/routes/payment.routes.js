const express = require("express")
const { createPayment, processWebhook, checkPaymentStatus } = require("../controllers/payment.controller")
const {
  validateRequest,
  orderValidationSchema,
} = require("../middleware/validation.middleware")
const { authenticateToken } = require("../middleware/auth.middleware")

const router = express.Router()

// Create payment
router.post("/create-payment", authenticateToken, validateRequest(orderValidationSchema), createPayment)

// Process webhook
router.get("/webhook", processWebhook)

router.post("/check-status", authenticateToken,checkPaymentStatus)
module.exports = router