const mongoose = require("mongoose")

const orderStatusSchema = new mongoose.Schema({
  collect_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  order_amount: {
    type: Number,
    required: true,
  },
  transaction_amount: {
    type: Number,
    required: true,
  },
  payment_mode: {
    type: String,
  },
  payment_details: {
    type: String,
  },
  bank_reference: {
    type: String,
  },
  payment_message: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  error_message: {
    type: String,
  },
  payment_time: {
    type: Date,
    default: Date.now,
  },
})

// Add indexes for frequently queried fields
orderStatusSchema.index({ collect_id: 1 })
orderStatusSchema.index({ status: 1 })
orderStatusSchema.index({ payment_time: -1 })

module.exports = mongoose.model("OrderStatus", orderStatusSchema)
