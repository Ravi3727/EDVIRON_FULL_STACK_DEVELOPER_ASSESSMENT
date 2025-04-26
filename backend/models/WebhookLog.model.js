const mongoose = require("mongoose")

const webhookLogSchema = new mongoose.Schema({
  payload: {
    type: Object,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  processed: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
  },
})

module.exports = mongoose.model("WebhookLog", webhookLogSchema)
