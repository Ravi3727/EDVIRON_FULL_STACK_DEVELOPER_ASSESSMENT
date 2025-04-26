const express = require("express")
const { register, login, getCurrentUser } = require("../controllers/auth.controller")
const { validateRequest, userValidationSchema } = require("../middleware/validation.middleware")
const { authenticateToken } = require("../middleware/auth.middleware")
const z = require("zod")

const router = express.Router()

// Register a new user
router.post("/register", validateRequest(userValidationSchema), register)

// Login user
router.post(
  "/login",
  validateRequest(
    z.object({
      username: z.string(),
      password: z.string(),
    }),
  ),
  login,
)

// Get current user
router.get("/me", authenticateToken, getCurrentUser)

module.exports = router
