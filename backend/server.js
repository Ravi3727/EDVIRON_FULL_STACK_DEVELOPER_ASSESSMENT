const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const morgan = require("morgan")
const connectDB = require("./config/db")

dotenv.config()

connectDB()


const app = express()

// Middleware
app.use(cors(
  {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }
))


app.use(express.json())
app.use(morgan("dev"))

// Routes

app.get("/",(req, res) => {
  res.send("Welcome to the Payment Gateway API");
})

app.use("/api/auth", require("./routes/auth.routes"))
app.use("/api/payments", require("./routes/payment.routes"))
app.use("/api/transactions", require("./routes/transaction.routes"))

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Server error",
    error: process.env.NODE_ENV === "development" ? err.message : "An unexpected error occurred",
  })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
