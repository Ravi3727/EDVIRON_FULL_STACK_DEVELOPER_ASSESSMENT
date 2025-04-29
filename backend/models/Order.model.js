const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  school_id: {
    type: String,
    required: true,
  },
  trustee_id: {
    type: String,
    required: true,
  },
  student_info: {
    name: { type: String, required: true },
    id: { type: String, required: true },
    email: { type: String, required: true },
  },
  gateway_name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  edviron_collect_id: {
    type: String,
    required: true,
  },
  custom_order_id: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Add indexes for frequently queried fields
orderSchema.index({ school_id: 1 })

module.exports = mongoose.model("Order", orderSchema)