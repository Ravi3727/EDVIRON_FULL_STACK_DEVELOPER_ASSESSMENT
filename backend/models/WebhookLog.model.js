const mongoose = require("mongoose")

const webhookLogSchema = new mongoose.Schema({
  collect_request_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["PENDING", "SUCCESS", "FAILED"],
    default: "PENDING",
  },
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  }
})

module.exports = mongoose.model("WebhookLog", webhookLogSchema)
